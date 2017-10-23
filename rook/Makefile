deploy1:
	kubectl create -f rook-operator.yaml
	watch kubectl -n rook-system get pod

deploy2:
	kubectl create -f rook-cluster.yaml
	watch kubectl -n rook get pod -o wide

deploy3:
	kubectl create -f rook-storageclass.yaml


delete:
	kubectl delete -f rook-operator.yaml; true
	kubectl delete -n rook-system daemonset rook-agent; true
	kubectl delete -n rook cluster rook; true
	kubectl delete -n rook serviceaccount rook-api; true
	kubectl delete -n rook role rook-api; true
	kubectl delete -n rook rolebinding rook-api; true
	kubectl delete -n rook serviceaccount rook-ceph-osd; true
	kubectl delete -n rook role rook-ceph-osd; true
	kubectl delete -n rook rolebinding rook-ceph-osd; true
	kubectl delete thirdpartyresources cluster.rook.io pool.rook.io objectstore.rook.io filesystem.rook.io volumeattachment.rook.io; true # ignore errors if on K8s 1.7+
	kubectl delete crd clusters.rook.io pools.rook.io objectstores.rook.io filesystems.rook.io volumeattachments.rook.io; true  # ignore errors if on K8s 1.5 and 1.6
	kubectl delete storageclass rook-block; true
	kubectl delete namespace rook; true
	kubectl delete namespace rook-system; true
