-- ============================================================
-- Buzón Donostia — DB2 Schema
-- Tables: PREGUNTAS, RESPUESTAS
-- ============================================================

CONNECT TO BUZONDIA;

-- -----------------------------------------------------------
-- Table: PREGUNTAS_HISTORICAS
-- Stores citizen questions with category & theme taxonomy
-- -----------------------------------------------------------
CREATE TABLE PREGUNTAS_HISTORICAS (
    ID          VARCHAR(10)  NOT NULL PRIMARY KEY,
    PREGUNTA    VARCHAR(500) NOT NULL,
    CATEGORIA   VARCHAR(40)  NOT NULL,
    TEMA        VARCHAR(40)  NOT NULL,
    CREATED_TS  TIMESTAMP    NOT NULL DEFAULT CURRENT TIMESTAMP
);

-- -----------------------------------------------------------
-- Table: RESPUESTAS_HISTORICAS
-- Stores model responses indexed by associated question
-- -----------------------------------------------------------
CREATE TABLE RESPUESTAS_HISTORICAS (
    ID          VARCHAR(10)  NOT NULL PRIMARY KEY,
    PREGUNTA    VARCHAR(500) NOT NULL,
    RESPUESTA   VARCHAR(2000) NOT NULL,
    CATEGORIA   VARCHAR(40)  NOT NULL,
    TEMA        VARCHAR(40)  NOT NULL,
    CREATED_TS  TIMESTAMP    NOT NULL DEFAULT CURRENT TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX IDX_PREG_CAT ON PREGUNTAS_HISTORICAS(CATEGORIA);
CREATE INDEX IDX_PREG_TEMA ON PREGUNTAS_HISTORICAS(TEMA);
CREATE INDEX IDX_RESP_CAT ON RESPUESTAS_HISTORICAS(CATEGORIA);
CREATE INDEX IDX_RESP_TEMA ON RESPUESTAS_HISTORICAS(TEMA);

-- Verify
SELECT 'PREGUNTAS_HISTORICAS' AS TABLA, COUNT(*) AS FILAS FROM PREGUNTAS_HISTORICAS;
SELECT 'RESPUESTAS_HISTORICAS' AS TABLA, COUNT(*) AS FILAS FROM RESPUESTAS_HISTORICAS;
