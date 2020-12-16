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
kubectl apply -f ./config/ServiceAccount_admin-user.yaml
kubectl create namespace kubernetes-ds
helm --namespace kubernetes-dashboard  install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard
export POD_NAME=$(kubectl get pods -n kubernetes-dashboard -l "app.kubernetes.io/name=kubernetes-dashboard,app.kubernetes.io/instance=kubernetes-dashboard" -o jsonpath="{.items[0].metadata.name}")
kubectl -n kubernetes-dashboard port-forward $POD_NAME 8443:8443

open https://127.0.0.1:8443/

# managed to log in using kubectl - other instructions untested:

# get the secret
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')
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



7. Check out the finance portal

```
curl -H "Host: finance-portal.local" ab7419cf221a94fdaa5ec1883f08e95e-639283179.eu-west-2.elb.amazonaws.com/finance-portal/

```

needed to change ingress to:
```yaml
kind: Ingress
apiVersion: extensions/v1beta1
metadata:
  name: mojaloop-finance-portal-frontend
  namespace: ml-app
  selfLink: >-
    /apis/extensions/v1beta1/namespaces/ml-app/ingresses/mojaloop-finance-portal-frontend
  uid: 6f1fb020-d688-46dc-9037-3482b29b9641
  resourceVersion: '12709'
  generation: 4
  creationTimestamp: '2020-12-16T04:28:12Z'
  labels:
    app.kubernetes.io/instance: mojaloop
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/name: finance-portal
    app.kubernetes.io/version: 10.4.0
    helm.sh/chart: finance-portal-11.0.0
  annotations:
    field.cattle.io/publicEndpoints: >-
      [{"addresses":["\u003cnil\u003e"],"port":80,"protocol":"HTTP","serviceName":"ml-app:mojaloop-finance-portal","ingressName":"ml-app:mojaloop-finance-portal-frontend","hostname":"finance-portal.oss-lab-beta.moja-lab.live","path":"/(.*)","allNodes":true}]
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: finance-portal.oss-lab-beta.moja-lab.live
      http:
        paths:
          - path: /(.*)
            backend:
              serviceName: mojaloop-finance-portal
              servicePort: 80
status:
  loadBalancer:
    ingress:
      - hostname: ab7419cf221a94fdaa5ec1883f08e95e-639283179.eu-west-2.elb.amazonaws.com


```

Aaand it looks like it doesn't even work... cool
I think the issue is still related to ingress and routing - the js doesn't load: e.g. http://finance-portal.oss-lab-beta.moja-lab.live/static/js/main.fed31bc4.chunk.js

## 2. Seed the environment

- can we use the testing toolkit for this now?


```bash
#set postInstallHook in ./config/mojaloop_values.yaml to true
kubens ml-app
helm --namespace ml-app upgrade --install mojaloop mojaloop/mojaloop -f ./config/mojaloop_values.yaml

```
## 3. Set Up an API Gateway

- kong? 
- AWS API Gateway? I'm not sure what's the easiest





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
