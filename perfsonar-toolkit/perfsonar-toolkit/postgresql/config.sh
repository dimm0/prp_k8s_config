#!/bin/bash

# Overlay the configuration files
if [ ! -f /var/lib/pgsql/$PG_VERSION/data/init_done ]; then
  su - postgres -p -c "/usr/pgsql-9.5/bin/pg_ctl initdb"
  cp ./postgresql.conf /var/lib/pgsql/$PG_VERSION/data/postgresql.conf
  cp ./pg_hba.conf /var/lib/pgsql/$PG_VERSION/data/pg_hba.conf

  /opt/postgresql/esmond-build-database
  touch /var/lib/pgsql/$PG_VERSION/data/init_done
fi
