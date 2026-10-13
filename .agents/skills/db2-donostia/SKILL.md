---
name: db2-donostia
description: "Connect and query the remote IBM DB2 database for Buzón Donostia (BUZONDIA). Use when: querying preguntas/respuestas, running SQL on db2.ikasten.dev, DB2 connection troubleshooting, working with citizen mailbox data."
argument-hint: "SQL query or task"
---

# DB2 Buzón Donostia — Conexión Remota

Base de datos IBM DB2 Community Edition 11.5.9.0 con datos del Buzón de la Ciudadanía de Donostia (50 preguntas + 30 respuestas históricas).

## Cuándo usar este skill

- Consultar `PREGUNTAS_HISTORICAS` o `RESPUESTAS_HISTORICAS`
- Ejecutar SQL contra la BD remota `BUZONDIA`
- Depurar conexión DB2 desde local
- Añadir o modificar datos del buzón ciudadano

## 🔐 Obtención de credenciales

Si necesitas la contraseña de DB2, puedes preguntar al usuario por la misma usando tool `vscode_askQuestions`. 

## Datos de conexión

| Parámetro         | Valor                   |
| ----------------- | ----------------------- |
| **Host**          | `db2.ikasten.dev`       |
| **Puerto**        | `50000`                 |
| **Base de datos** | `BUZONDIA`              |
| **Usuario**       | `db2inst1`              |
| **Password**      | 🔐 Solicitar al usuario |
| **Versión DB2**   | 11.5.9.0                |

## Conexión desde Python (ibm_db)

> Sustituye `${DB2_PASSWORD}` por el valor proporcionado por el usuario.

```python
import ibm_db

conn = ibm_db.connect(
    'DATABASE=BUZONDIA;HOSTNAME=db2.ikasten.dev;PORT=50000;PROTOCOL=TCPIP;UID=db2inst1;PWD=${DB2_PASSWORD}',
    '', ''
)

# Ejecutar consulta
stmt = ibm_db.exec_immediate(conn, 'SELECT * FROM PREGUNTAS_HISTORICAS WHERE TEMA = \'Movilidad\'')
result = ibm_db.fetch_both(stmt)
while result:
    print(result['ID'], result['PREGUNTA'])
    result = ibm_db.fetch_both(stmt)

ibm_db.close(conn)
```

**Nota**: Cada llamada a `ibm_db.exec_immediate` usa una transacción independiente. Si necesitas múltiples consultas en secuencia, re-conecta o usa `ibm_db.autocommit`.

## 🪟 Windows (PowerShell) — puesta en marcha rápida

Atajos para no perder tiempo en Windows:

1. **Instalar el driver** (solo la primera vez). El paquete `ibm_db` incluye el `clidriver` de DB2, **no** hace falta instalar el cliente IBM aparte:
   ```powershell
   pip install ibm_db
   python -c "import ibm_db; print(ibm_db.__version__)"   # verificar
   ```

2. **No uses `python -c "..."` con comillas, acentos o `¿`**: PowerShell los destroza. Escribe un `.py` temporal y ejecútalo.

3. **Password sin exponerla**: pídela con `Read-Host -AsSecureString` y pásala por variable de entorno (el script lee `os.environ["DB2_PASSWORD"]`):
   ```powershell
   $sec = Read-Host "Password DB2 (db2inst1)" -AsSecureString
   $env:DB2_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
   python add_pregunta.py
   ```

4. **Insertar una pregunta nueva** con ID auto (`MAX(ID)+1`, formato `qNNN`). Usa `prepare` + `bind_param` para evitar problemas de escapado con acentos y comillas:
   ```python
   insert_sql = ("INSERT INTO PREGUNTAS_HISTORICAS (ID, PREGUNTA, CATEGORIA, TEMA, CREATED_TS) "
                 "VALUES (?, ?, ?, ?, CURRENT TIMESTAMP)")
   stmt = ibm_db.prepare(conn, insert_sql)
   ibm_db.bind_param(stmt, 1, new_id)
   ibm_db.bind_param(stmt, 2, pregunta)
   ibm_db.bind_param(stmt, 3, categoria)
   ibm_db.bind_param(stmt, 4, tema)
   ibm_db.execute(stmt)
   ```

5. **Verificar**: `SELECT COUNT(*) FROM PREGUNTAS_HISTORICAS` y `SELECT * FROM PREGUNTAS_HISTORICAS WHERE ID = 'qNNN'`.

> ⚠️ **`add_pregunta.py` es solo un EJEMPLO/plantilla**, no un script a reutilizar tal cual. Contiene una pregunta concreta hardcodeada; **cada vez hay que escribir una pregunta nueva y distinta** (texto, categoría y tema propios). Cópialo como base, cambia `PREGUNTA`/`CATEGORIA`/`TEMA` (o pásalos por argumentos) y ejecútalo. Nunca reinsertes la misma pregunta.

## Conexión desde DBeaver / cliente SQL genérico

- **JDBC URL**: `jdbc:db2://db2.ikasten.dev:50000/BUZONDIA`
- **Driver**: IBM DB2 LUW
- **Password**: solicitar al usuario con `vscode_askQuestions` antes de conectar

## Esquema de la base de datos

### PREGUNTAS_HISTORICAS (50 filas)

| Columna      | Tipo           | Descripción                                             |
| ------------ | -------------- | ------------------------------------------------------- |
| `ID`         | VARCHAR(10) PK | q001-q050                                               |
| `PREGUNTA`   | VARCHAR(500)   | Texto de la pregunta ciudadana                          |
| `CATEGORIA`  | VARCHAR(40)    | QUEJAS, CONSULTAS, AVISOS, PROPUESTAS Y AGRADECIMIENTOS |
| `TEMA`       | VARCHAR(40)    | Movilidad, Limpieza y Residuos, Pagos, etc.             |
| `CREATED_TS` | TIMESTAMP      | Fecha de creación                                       |

### RESPUESTAS_HISTORICAS (30 filas)

| Columna      | Tipo           | Descripción                  |
| ------------ | -------------- | ---------------------------- |
| `ID`         | VARCHAR(10) PK | r001-r030                    |
| `PREGUNTA`   | VARCHAR(500)   | Texto de pregunta asociada   |
| `RESPUESTA`  | VARCHAR(2000)  | Texto de la respuesta modelo |
| `CATEGORIA`  | VARCHAR(40)    | Categoría de la respuesta    |
| `TEMA`       | VARCHAR(40)    | Tema de la respuesta         |
| `CREATED_TS` | TIMESTAMP      | Fecha de creación            |

### Índices

- `IDX_PREG_CAT` — sobre `PREGUNTAS_HISTORICAS(CATEGORIA)`
- `IDX_PREG_TEMA` — sobre `PREGUNTAS_HISTORICAS(TEMA)`
- `IDX_RESP_CAT` — sobre `RESPUESTAS_HISTORICAS(CATEGORIA)`
- `IDX_RESP_TEMA` — sobre `RESPUESTAS_HISTORICAS(TEMA)`

## Consultas de ejemplo

```sql
-- Distribución por categoría
SELECT CATEGORIA, COUNT(*) AS TOTAL
FROM PREGUNTAS_HISTORICAS
GROUP BY CATEGORIA
ORDER BY TOTAL DESC;

-- Preguntas de un tema concreto
SELECT ID, PREGUNTA FROM PREGUNTAS_HISTORICAS
WHERE TEMA = 'Movilidad';

-- Respuestas relacionadas con una categoría
SELECT ID, LEFT(RESPUESTA, 120) AS RESPUESTA_CORTA
FROM RESPUESTAS_HISTORICAS
WHERE CATEGORIA = 'QUEJAS';

-- Preguntas sin respuesta asociada (por categoria+tema)
SELECT P.ID, P.PREGUNTA, P.CATEGORIA, P.TEMA
FROM PREGUNTAS_HISTORICAS P
WHERE NOT EXISTS (
    SELECT 1 FROM RESPUESTAS_HISTORICAS R
    WHERE R.CATEGORIA = P.CATEGORIA AND R.TEMA = P.TEMA
);
```

## Verificar conectividad desde local

```bash
# DNS
dig +short db2.ikasten.dev    # debe devolver 65.109.20.113

# TCP
nc -z db2.ikasten.dev 50000   # debe decir "succeeded" o salir con código 0
```

**Windows (PowerShell)** — `dig` y `nc` no existen; usa:
```powershell
Resolve-DnsName db2.ikasten.dev | Select-Object Name,IPAddress
Test-NetConnection db2.ikasten.dev -Port 50000   # TcpTestSucceeded : True
```

## Archivos del proyecto

El código fuente de la configuración Docker está en `/opt/donostiatik/skills/db2/` (Dockerfile, docker-compose.yml, init scripts).
