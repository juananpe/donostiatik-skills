"""FastAPI backend para el Buzón Donostia — consulta tablas DB2 remotas."""

import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import ibm_db

app = FastAPI(title="Buzón Donostia API")

# CORS para permitir frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Conexión DB2 ──────────────────────────────────────────────
DB_CONFIG = {
    "host": os.getenv("DB2_HOST", "db2.ikasten.dev"),
    "port": os.getenv("DB2_PORT", "50000"),
    "database": os.getenv("DB2_DATABASE", "BUZONDIA"),
    "user": os.getenv("DB2_USER", "db2inst1"),
    "password": os.getenv("DB2_PASSWORD", "Donostia2026!"),
}


def get_conn():
    conn_str = (
        f"DATABASE={DB_CONFIG['database']};"
        f"HOSTNAME={DB_CONFIG['host']};"
        f"PORT={DB_CONFIG['port']};"
        f"PROTOCOL=TCPIP;"
        f"UID={DB_CONFIG['user']};"
        f"PWD={DB_CONFIG['password']}"
    )
    return ibm_db.connect(conn_str, "", "")


def query_all(sql: str) -> list[dict]:
    """Ejecuta una consulta y devuelve todas las filas como lista de dicts."""
    conn = get_conn()
    try:
        stmt = ibm_db.exec_immediate(conn, sql)
        rows = []
        result = ibm_db.fetch_both(stmt)
        while result:
            row = {}
            for i in range(ibm_db.num_fields(stmt)):
                name = ibm_db.field_name(stmt, i)
                val = result[i]
                # Convertir timestamps a string
                if hasattr(val, "strftime"):
                    val = val.strftime("%Y-%m-%d %H:%M:%S")
                row[name] = val
            rows.append(row)
            result = ibm_db.fetch_both(stmt)
        return rows
    finally:
        ibm_db.close(conn)


# ── Endpoints ─────────────────────────────────────────────────


@app.get("/api/preguntas")
def get_preguntas():
    """Devuelve todas las preguntas históricas."""
    try:
        rows = query_all("SELECT * FROM PREGUNTAS_HISTORICAS ORDER BY ID")
        return {"ok": True, "total": len(rows), "data": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/respuestas")
def get_respuestas():
    """Devuelve todas las respuestas históricas."""
    try:
        rows = query_all("SELECT * FROM RESPUESTAS_HISTORICAS ORDER BY ID")
        return {"ok": True, "total": len(rows), "data": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/resumen")
def get_resumen():
    """Devuelve un resumen: conteos por categoría y tema."""
    try:
        categorias = query_all(
            "SELECT CATEGORIA, COUNT(*) AS TOTAL FROM PREGUNTAS_HISTORICAS GROUP BY CATEGORIA ORDER BY TOTAL DESC"
        )
        temas = query_all(
            "SELECT TEMA, COUNT(*) AS TOTAL FROM PREGUNTAS_HISTORICAS GROUP BY TEMA ORDER BY TOTAL DESC"
        )
        return {"ok": True, "categorias": categorias, "temas": temas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Servir frontend estático ──────────────────────────────────
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
