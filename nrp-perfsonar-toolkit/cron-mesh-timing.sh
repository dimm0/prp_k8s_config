0 0,6,12,18 * * * root /usr/local/bin/cron-gridftp-transfer-mesh.sh &> /var/log/cron-gridftp-transfer-mesh.log	#	ps-40g-gridftp.calit2.optiputer.net
10 * * * * root /usr/local/bin/cron-load-gridftp.sh &> /var/log/cron-gridftp-load.log	#	ps-40g-gridftp.calit2.optiputer.net
15 0,6,12,18 * * * root /usr/local/bin/cron-gridftp-transfer-mesh.sh &> /var/log/cron-gridftp-transfer-mesh.log	#	dtn.cahnrs.wsu.edu
11 * * * * root /usr/local/bin/cron-load-gridftp.sh &> /var/log/cron-gridftp-load.log	#	dtn.cahnrs.wsu.edu
30 0,6,12,18 * * * root /usr/local/bin/cron-gridftp-transfer-mesh.sh &> /var/log/cron-gridftp-transfer-mesh.log	#	hpcdtn01-ext.clemson.edu
12 * * * * root /usr/local/bin/cron-load-gridftp.sh &> /var/log/cron-gridftp-load.log	#	hpcdtn01-ext.clemson.edu
45 0,6,12,18 * * * root /usr/local/bin/cron-gridftp-transfer-mesh.sh &> /var/log/cron-gridftp-transfer-mesh.log	#	sage2rtt.evl.uic.edu
13 * * * * root /usr/local/bin/cron-load-gridftp.sh &> /var/log/cron-gridftp-load.log	#	sage2rtt.evl.uic.edu