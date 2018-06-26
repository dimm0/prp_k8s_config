#!/bin/bash
TMPFILE=`mktemp`
python2 /usr/bin/esmond-ps-load-gridftp -p gridftp.pickle -U https://nrp-perfsonar.nautilus.optiputer.net/esmond -u gridftp -k 3db5dbd582fb4316f8be96138f39b15cb46cd713 -f /var/log/gridftp-transfer.log 

curl -s https://nrp-perfsonar.nautilus.optiputer.net/cron-gridftp-transfer-mesh.sh -o /usr/local/bin/cron-gridftp-transfer-mesh.sh
chmod 755 /usr/local/bin/cron-gridftp-transfer-mesh.sh
sed -i '/'"$HOSTNAME"'/s/^/#/' /usr/local/bin/cron-gridftp-transfer-mesh.sh

curl -s https://nrp-perfsonar.nautilus.optiputer.net/cron-mesh-timing.sh -o $TMPFILE

MY_HOSTNAME=`hostname -f`

grep -iq $MY_HOSTNAME $TMPFILE
RC=$?

if [[ $RC -eq 0 ]];then
      grep -i $MY_HOSTNAME $TMPFILE > /etc/cron.d/cron-gridftp-transfer-mesh
else
      logger -t "$0" 'Error while downloading cronjob files'
fi

rm -f $TMPFILE