#!/bin/bash
# ============================================================
# DB2 post-setup script — executed automatically by entrypoint
# after DB2 instance & database are ready.
#
# Location: /var/custom/ (DB2 entrypoint scans this dir)
# ============================================================
set -e

INSTANCE="${DB2INSTANCE:-db2inst1}"
DBNAME="${DBNAME:-BUZONDIA}"

echo "🔧 Running Buzón Donostia seed scripts..."

# Wait until DB2 is fully ready
for i in $(seq 1 60); do
    if su - "${INSTANCE}" -c "db2 connect to ${DBNAME}" > /dev/null 2>&1; then
        echo "✅ DB2 ready after ${i}s"
        break
    fi
    sleep 2
done

# Run table creation
echo "📋 Creating tables..."
su - "${INSTANCE}" -c "db2 -tvf /var/custom/01-tables.sql"

# Run seed data
echo "🌱 Seeding data..."
su - "${INSTANCE}" -c "db2 -tvf /var/custom/02-seed.sql"

echo "🎉 Buzón Donostia seed complete!"
echo "   Database: ${DBNAME}"
echo "   Tables: PREGUNTAS_HISTORICAS, RESPUESTAS_HISTORICAS"

# Show summary
su - "${INSTANCE}" -c "db2 connect to ${DBNAME} && db2 'SELECT CATEGORIA, COUNT(*) AS TOTAL FROM PREGUNTAS_HISTORICAS GROUP BY CATEGORIA ORDER BY TOTAL DESC'"
