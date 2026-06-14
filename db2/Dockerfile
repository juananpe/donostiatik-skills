# Custom DB2 Community Edition image with Buzón Donostia seed data
# Base image from IBM Container Registry (successor of ibmcom/db2)
FROM icr.io/db2_community/db2:11.5.9.0

# Copy init scripts — executed automatically after DB2 setup completes
RUN mkdir -p /var/custom
COPY init/setup.sh /var/custom/
COPY init/01-tables.sql /var/custom/
COPY init/02-seed.sql /var/custom/
RUN chmod a+x /var/custom/setup.sh
