# OSS Lab Deployment Guide


## 1. Spin up the kubernetes cluster

1. Log into rancher, create a new cluster

```
cluster name: oss-lab-beta 
version: 1.17.14-rancher-1-1
master: 3x m5.large
workers: 2x m5.xlarge

```

2. Download kubectl etc.
```bash
kubectx 
# oss-lab-beta

kubectl get po --all-namespaces
```

3. [optional] Install the k8s dashboard

ref: https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/

```bash
# create a service account for the user
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml
kubectl apply -f ./config/ServiceAccount_admin-user.yaml

# get the secret
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')

kubectl proxy

open http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

... hmm getting default backend, maybe come back to this issue

```


3. Install Mojaloop v11 from Helm

```bash
helm repo add mojaloop http://mojaloop.io/helm/repo/
helm repo add incubator http://storage.googleapis.com/kubernetes-charts-incubator
helm repo add kiwigrid https://kiwigrid.github.io
helm repo add elastic https://helm.elastic.co
helm repo add bitnami https://charts.bitnami.com/bitnami


kubectl create namespace ml-app
helm --namespace ml-app upgrade --install mojaloop mojaloop/mojaloop 
# NAME: mojaloop
# LAST DEPLOYED: Wed Dec 16 12:34:06 2020
# NAMESPACE: ml-app
# STATUS: deployed
# REVISION: 1
```

4. Try a basic health check before setting up ingress

```

curl localhost:8002/api/v1/namespaces/ml-app/services/http:mojaloop-centralledger-service:/proxy/health -H "Host: central-ledger.local"
```
nope...

5. Set up ingress

```bash
helm --namespace kube-public install ingress ingress-nginx/ingress-nginx
kubens kube-public
kubectl get service/ingress-ingress-nginx-controller

ab7419cf221a94fdaa5ec1883f08e95e-639283179.eu-west-2.elb.amazonaws.com
```

6. health checks

```bash
curl -H "Host: account-lookup-service.local" ab7419cf221a94fdaa5ec1883f08e95e-639283179.eu-west-2.elb.amazonaws.com/health
curl -H "Host: ml-api-adapter.local" ab7419cf221a94fdaa5ec1883f08e95e-639283179.eu-west-2.elb.amazonaws.com/health
curl -H "Host: central-ledger.local" ab7419cf221a94fdaa5ec1883f08e95e-639283179.eu-west-2.elb.amazonaws.com/health
```

## TODO 
- [x] change name prefix to something more readable

- [ ] install an api gateway
  - dns: `oss-lab-beta.mojaloop.live`
  - use path based routing, eg:

```
oss-lab-beta.mojaloop.live/ui - any UI components
oss-lab-beta.mojaloop.live/api/fspiop - FSPIOP api
oss-lab-beta.mojaloop.live/api/admin
oss-lab-beta.mojaloop.live/api/thirdparty
```  



## Isssues with docs

- What yaml file to use when installing? not easy to find
- Make dashboard optional, and add to the end - it's not important
- `helm --namespace kube-public install stable/nginx-ingress` fails, it should be `helm --namespace kube-public install ingress ingress-nginx/ingress-nginx`
