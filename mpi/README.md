Add rolebindings:

`kubectl create -n <YOUR_NAMESPACE> -f https://github.com/dimm0/prp_k8s_config/blob/master/mpi/rolebindings.yaml`

Install helm if not installed:

[https://github.com/kubernetes/helm#install]

Follow the guide in kube-openmpi project:

[https://github.com/everpeace/kube-openmpi#quick-start]

Remember, you can only work within your own namespace. If something is not working, check that you've specified one.