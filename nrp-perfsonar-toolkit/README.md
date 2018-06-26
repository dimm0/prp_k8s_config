

>kubectl create -f perfsonar-toolkit.yaml -n nrp-perfsonar

>kubectl delete -f perfsonar-toolkit.yaml -n nrp-perfsonar

>Cassandra replication:

>echo "ALTER KEYSPACE esmond WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 2 };" | cqlsh esmond-cassandra
