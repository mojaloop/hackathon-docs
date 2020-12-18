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
helm --namespace ml-app upgrade --install mojaloop mojaloop/mojaloop -f ./config/mojaloop_values.yaml --wait --timeout 30m

helm upgrade --install  --namespace ml-app mojaloop mojaloop/mojaloop  -f ./config/values-dev2-mojaloop-harness.yaml --wait --timeout 10m  --set ml-ttk-posthook-setup.postInstallHook.enabled=true,ml-ttk-posthook-tests.postInstallHook.enabled=true

```

this fails with the following:
```
kubectl logs -f mojaloop-ml-ttk-posthook-setup-j8jgl
...
Listening on http://mojaloop-ml-testing-toolkit-backend:5050 outboundProgress events...
Error: getaddrinfo ENOTFOUND mojaloop-ml-testing-toolkit-backend
```
## 3. Set Up an API Gateway

- AWS API Gateway? I'm not sure what's the easiest
	- fspiop-v1.1
	- admin api
	- pisp api
	- API keys for each team


https://docs.konghq.com/2.2.x/kong-for-kubernetes/install/

1. Installing kong:
```bash
kubens ml-app

helm repo add kong https://charts.konghq.com
helm repo update
helm install kong kong/kong --set ingressController.installCRDs=false
```


2. Set up some ingress I suppose


```bash
HOST=a287d03f90bf14e589d90fd2335651e1-1901765432.eu-west-2.elb.amazonaws.com
PORT=80
export PROXY_IP=${HOST}:${PORT}
echo $PROXY_IP
curl -i $PROXY_IP

# examples
kubectl apply -f https://bit.ly/echo-service
kubectl apply -f ./config/ingress_demo.yaml

# now test it out
curl -i $PROXY_IP/foo

kubectl apply -f ./config/ingress_demo_plugin.yaml
curl -i -H "Host: example.com" $PROXY_IP/bar/sample


kubectl apply -f ./config/ingress_demo_service.yaml
kubectl patch svc echo -p '{"metadata":{"annotations":{"konghq.com/plugins": "rl-by-ip\n"}}}'
curl -I $PROXY_IP/foo

# clean up

kubectl delete -f ./config/ingress_demo_service.yaml
kubectl delete -f ./config/ingress_demo_plugin.yaml
kubectl delete -f ./config/ingress_demo.yaml
kubectl delete -f https://bit.ly/echo-service
```


```bash
# now trying out our own stuff
kubectl apply -f ./config/ingress_kong_fspiop.yaml
kubectl apply -f ./config/ingress_kong_admin.yaml

# expose the kubernetes dashboard using nginx ingress - this is easier than kong... but might come back to bite us
helm --namespace kubernetes-dashboard install ingress ingress-nginx/ingress-nginx
kubens kubernetes-dashboard
kubectl get service/ingress-ingress-nginx-controller

kubectl apply -f ./config/ingress_nginx_dashboard.yaml
kubectl apply -f https://bit.ly/echo-service

# health checks:
http://beta.moja-lab.live/api/admin/participants/health
http://beta.moja-lab.live/api/admin/parties/health
http://beta.moja-lab.live/api/admin/transactionRequests/health
http://beta.moja-lab.live/api/admin/authorizations/health
http://beta.moja-lab.live/api/admin/quotes/health
http://beta.moja-lab.live/api/admin/transfers/health

# FSPIOP API endpoints
http://beta.moja-lab.live/api/fspiop/participants
http://beta.moja-lab.live/api/fspiop/parties
http://beta.moja-lab.live/api/fspiop/transactionRequests
http://beta.moja-lab.live/api/fspiop/authorizations
http://beta.moja-lab.live/api/fspiop/quotes
http://beta.moja-lab.live/api/fspiop/transfers

# Admin API
http://beta.moja-lab.live/api/admin/central-ledger
http://beta.moja-lab.live/api/admin/account-lookup-service
http://beta.moja-lab.live/api/admin/account-lookup-service-admin

# k8s dashboard? That would be nice...
https://dashboard.beta.moja-lab.live

# PISP API
TODO!!
```

## 4. Homepage

- What type of homepage for Mojaloop could we throw together in a couple hours?

"Welcome to Mojaloop - Dev Portal"
- get your API Key
- links to docs
- hosted swagger that points directly to the apis
- use cases + code snippets
- demos 


```bash
cd dev-portal
docker-compose build
docker push lewisdaly/dev-portal:latest

kubectl apply -f ./config/dev-portal.yaml
```


TODO:
- [ ] placeholder demo pages
- [ ] better homepage
- [ ] start P2P guide (from DFSP perspective)
  Here's a great example of a good developer guide: https://uat-isac.happay.in/v2/docs




## TODO 
- [x] change name prefix to something more readable
- [x] install an api gateway
  - dns: `oss-lab-beta.mojaloop.live`
  - use path based routing, eg:




- [ ] setup seed environment
- [ ] deploy simulator UIs and expose
- [ ] learn about security, and implement JWS? 






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
