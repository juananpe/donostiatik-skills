"""EJEMPLO de inserción de una pregunta en PREGUNTAS_HISTORICAS (DB2 BUZONDIA).

⚠️  Esto es solo una PLANTILLA de referencia, NO un script a reutilizar tal cual.
    Contiene una pregunta concreta hardcodeada. Cada vez hay que escribir una
    pregunta NUEVA y distinta: cambia PREGUNTA / CATEGORIA / TEMA antes de ejecutar.
    Nunca reinsertes la misma pregunta.

La contraseña se lee de la variable de entorno DB2_PASSWORD.
Uso (PowerShell):
    $env:DB2_PASSWORD = "<password>"
    python add_pregunta.py
"""
import os
import sys

import ibm_db

DB2_PASSWORD = os.environ.get("DB2_PASSWORD")
if not DB2_PASSWORD:
    sys.exit("ERROR: define la variable de entorno DB2_PASSWORD antes de ejecutar.")

CONN_STR = (
    "DATABASE=BUZONDIA;HOSTNAME=db2.ikasten.dev;PORT=50000;"
    f"PROTOCOL=TCPIP;UID=db2inst1;PWD={DB2_PASSWORD}"
)

PREGUNTA = (
    "Gracias a la ayudita he podido comprar muchos gorrocopteros. "
    "Animos y saludos \u2014 Doraemon"
)
CATEGORIA = "AGRADECIMIENTOS"
TEMA = "Pagos"

conn = ibm_db.connect(CONN_STR, "", "")
if not conn:
    sys.exit(f"ERROR: no se pudo conectar: {ibm_db.conn_errormsg()}")

try:
    # Calcular el siguiente ID disponible (formato qNNN)
    stmt = ibm_db.exec_immediate(conn, "SELECT MAX(ID) AS MAXID FROM PREGUNTAS_HISTORICAS")
    row = ibm_db.fetch_assoc(stmt)
    max_id = (row or {}).get("MAXID") or "q000"
    try:
        next_num = int(str(max_id).lstrip("qQ")) + 1
    except ValueError:
        next_num = 1
    new_id = f"q{next_num:03d}"

    # Insertar la nueva pregunta
    insert_sql = (
        "INSERT INTO PREGUNTAS_HISTORICAS (ID, PREGUNTA, CATEGORIA, TEMA, CREATED_TS) "
        "VALUES (?, ?, ?, ?, CURRENT TIMESTAMP)"
    )
    stmt = ibm_db.prepare(conn, insert_sql)
    ibm_db.bind_param(stmt, 1, new_id)
    ibm_db.bind_param(stmt, 2, PREGUNTA)
    ibm_db.bind_param(stmt, 3, CATEGORIA)
    ibm_db.bind_param(stmt, 4, TEMA)
    ibm_db.execute(stmt)

    # Verificar
    stmt = ibm_db.exec_immediate(
        conn, f"SELECT ID, PREGUNTA, CATEGORIA, TEMA, CREATED_TS "
              f"FROM PREGUNTAS_HISTORICAS WHERE ID = '{new_id}'"
    )
    result = ibm_db.fetch_assoc(stmt)
    print("INSERT OK:")
    print(result)

    stmt = ibm_db.exec_immediate(conn, "SELECT COUNT(*) AS TOTAL FROM PREGUNTAS_HISTORICAS")
    print("TOTAL PREGUNTAS:", ibm_db.fetch_assoc(stmt))
finally:
    ibm_db.close(conn)
