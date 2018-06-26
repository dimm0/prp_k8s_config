>kubectl create -f perfsonar-toolkit.yaml --namespace=kube-public

>kubectl delete -f perfsonar-toolkit.yaml --namespace=kube-public

>Cassandra replication:
>echo "ALTER KEYSPACE esmond WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 2 };" | cqlsh esmond-cassandra
