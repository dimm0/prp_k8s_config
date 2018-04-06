#!/bin/bash

# Overlay the configuration files
if [ ! -f /var/lib/pgsql/$PG_VERSION/data/init_done ]; then
  su - postgres -c "/usr/pgsql-9.5/bin/pg_ctl initdb"
  su - postgres -c "cp -f /opt/postgresql/postgresql.conf /var/lib/pgsql/$PG_VERSION/data/"
  su - postgres -c "cp -f /opt/postgresql/pg_hba.conf /var/lib/pgsql/$PG_VERSION/data/"

  /opt/postgresql/esmond-build-database
  touch /var/lib/pgsql/$PG_VERSION/data/init_done
fi
