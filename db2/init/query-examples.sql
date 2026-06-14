-- ============================================================
-- Buzón Donostia — Query Examples for DB2
-- ============================================================

CONNECT TO BUZONDIA;

-- 1. All questions by category
SELECT CATEGORIA, COUNT(*) AS TOTAL
FROM PREGUNTAS_HISTORICAS
GROUP BY CATEGORIA
ORDER BY TOTAL DESC;

-- 2. All questions by theme
SELECT TEMA, COUNT(*) AS TOTAL
FROM PREGUNTAS_HISTORICAS
GROUP BY TEMA
ORDER BY TOTAL DESC;

-- 3. Find responses for a specific topic (like "Movilidad")
SELECT R.ID, R.PREGUNTA, LEFT(R.RESPUESTA, 100) AS RESPUESTA_CORTA
FROM RESPUESTAS_HISTORICAS R
WHERE R.TEMA = 'Movilidad';

-- 4. Questions with matching responses (join on category + topic)
SELECT P.ID AS PREG_ID, P.PREGUNTA, R.ID AS RESP_ID,
       LEFT(R.RESPUESTA, 80) AS RESPUESTA_CORTA
FROM PREGUNTAS_HISTORICAS P
LEFT JOIN RESPUESTAS_HISTORICAS R
  ON P.CATEGORIA = R.CATEGORIA AND P.TEMA = R.TEMA
WHERE P.TEMA = 'Limpieza y Residuos'
FETCH FIRST 5 ROWS ONLY;

-- 5. Questions without a matching response (by category+tema)
SELECT P.ID, P.PREGUNTA, P.CATEGORIA, P.TEMA
FROM PREGUNTAS_HISTORICAS P
WHERE NOT EXISTS (
    SELECT 1 FROM RESPUESTAS_HISTORICAS R
    WHERE R.CATEGORIA = P.CATEGORIA AND R.TEMA = P.TEMA
);
