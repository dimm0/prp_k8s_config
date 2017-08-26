# runuser -l postgres -c '/usr/pgsql-9.5/bin/postgresql95-check-db-dir /var/lib/pgsql/9.5/data/'
# runuser -l postgres -c '/usr/pgsql-9.5/bin/pg_ctl start -D /var/lib/pgsql/9.5/data/ -s -w -t 300'

/usr/bin/bwctld -c /etc/bwctl-server -R /var/run
/usr/bin/owampd -c /etc/owamp-server -R /var/run

/usr/lib/perfsonar/bin/config_daemon.pl --config=/etc/perfsonar/toolkit/configdaemon.conf --pidfile=/var/run/configdaemon.pid --logger=/etc/perfsonar/toolkit/configdaemon-logger.conf --user=perfsonar --group=perfsonar
/usr/lib/perfsonar/bin/lscachedaemon.pl --config=/etc/perfsonar/lscachedaemon.conf --logger=/etc/perfsonar/lscachedaemon-logger.conf --user=perfsonar --group=perfsonar
/usr/lib/perfsonar/bin/lsregistrationdaemon.pl --config=/etc/perfsonar/lsregistrationdaemon.conf --logger=/etc/perfsonar/lsregistrationdaemon-logger.conf --user=perfsonar --group=perfsonar

#After=network.target  pscheduler-scheduler.service pscheduler-archiver.service pscheduler-ticker.service pscheduler-runner.service
/usr/lib/perfsonar/bin/perfsonar_meshconfig_agent --config=/etc/perfsonar/meshconfig-agent.conf --logger=/etc/perfsonar/meshconfig-agent-logger.conf --pidfile=/var/run/perfsonar-meshconfig-agent.pid --user=perfsonar --group=perfsonar

/usr/bin/touch /var/run/perfsonar-oppd-server.pid
/bin/chown perfsonar:perfsonar /var/run/perfsonar-oppd-server.pid
/usr/lib/perfsonar/bin/oppd-server.pl --config=/etc/perfsonar/oppd-server.conf --pidfile=/var/run/perfsonar-oppd-server.pid --logfile=/var/log/perfsonar/oppd-server.log

/bin/touch /var/run/pscheduler-archiver.pid
/bin/chown pscheduler:pscheduler /var/run/pscheduler-archiver.pid

#EnvironmentFile=-/var/run/pscheduler-archiver.options
/usr/libexec/pscheduler/daemons/archiver --daemon --pid-file /var/run/pscheduler-archiver.pid --dsn @/etc/pscheduler/database/database-dsn $OPTIONS
/bin/touch /var/run/pscheduler-runner.pid
/bin/chown pscheduler:pscheduler /var/run/pscheduler-runner.pid
#EnvironmentFile=-/var/run/pscheduler-runner.options
/usr/libexec/pscheduler/daemons/runner --daemon --pid-file /var/run/pscheduler-runner.pid --dsn @/etc/pscheduler/database/database-dsn $OPTIONS
ExecStopPost=/bin/rm -f /var/run/pscheduler-runner.pid /var/run/pscheduler-runner.options

/bin/touch /var/run/pscheduler-scheduler.pid
/bin/chown pscheduler:pscheduler /var/run/pscheduler-scheduler.pid
#EnvironmentFile=-/var/run/pscheduler-scheduler.options
/usr/libexec/pscheduler/daemons/scheduler --daemon --pid-file /var/run/pscheduler-scheduler.pid --dsn @/etc/pscheduler/database/database-dsn $OPTIONS

/bin/touch /var/run/pscheduler-ticker.pid
/bin/chown pscheduler:pscheduler /var/run/pscheduler-ticker.pid
#EnvironmentFile=-/var/run/pscheduler-ticker.options
/usr/libexec/pscheduler/daemons/ticker --daemon --pid-file /var/run/pscheduler-ticker.pid --dsn @/etc/pscheduler/database/database-dsn $OPTIONS

cd /usr/lib/esmond && python esmond/manage.py syncdb --no-input && python esmond/manage.py cassandra_init --no-input
