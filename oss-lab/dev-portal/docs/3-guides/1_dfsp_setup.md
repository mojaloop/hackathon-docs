# 1. DFSP Setup

This guide will help you set up your own bare-bones DFSP server to send and receive Mojaloop requests using Mojaloop's [FSPIOP API](/2-apis/fspiop/)

## Prerequisites:

- Your DFSP_ID, this will be assigned to you
- `localtunnel` 
- `sdk-scheme-adapter` ?? - [todo - or should we make some sort of 'starter kit'?]
  - or can we run a super simple server to get callbacks from the switch?

- `docker run -p 8081:8080 -p 8443:8443 --rm -t mendhak/http-https-echo:15`

<Block>

## Run a Mock server and Enrol your DFSP

In this step, we run a simple web server to listen to callbacks 


```bash
docker run -p 8081:8080 -p 8443:8443 --rm -t mendhak/http-https-echo:15
npx localtunnel --port 8081 --print-requests

# prints:
#  your url is: https://curvy-panda-37.loca.lt


# now try curling the localtunnel, and check the docker logs
curl -X POST https://curvy-panda-37.loca.lt -d '{"hello":true}'


curl -X POST -H 'Content-Type: application/json' http://beta.moja-lab.live/api/admin/central-ledger/participants -d '{"name":"applebank", "currency":"USD"}'
curl -X POST -H 'Content-Type: application/json' http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank/initialPositionAndLimits \
  -d '{"currency":"USD", "limit": {"type":"NET_DEBIT_CAP", "value": 10000}, "initialPosition": 0}'

# get the settlement accountId
curl -H 'Content-Type: application/json' http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank | jq

# check output for the ledgerAccountType, and get the associated id. In my case, this is 18
# you can make up your own transferId, just make sure it follows the same format!

curl -X POST -H 'Content-Type: application/json' http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank/accounts/18 \
  -d '{
        "transferId": "387ee6b9-520d-4c51-a9e4-6eb2ef15887d",
        "externalReference": "n/a",
        "action": "recordFundsIn",
        "reason": "dfsp setup",
        "amount": {
          "amount": 5000,
          "currency": "USD"
        }
      }'

# register your endpoints with the hub


```

```
POST /something/
```

<Example>

<CURL>
```bash
curl -X POST http://beta.moja-lab.live/api/admin/something \
  --data '{
    "username": "my-username",
    "password": "my-password"
  }'
```
</CURL>

</Example>

</Block>

<Block>

## Test your DFSP Setup

```
GET /parties/{Type}/{ID}
```

Now let's try testing that everything is working as expected by issuing a [`GET /parties`](todo-link) call. 
`GET /parties` is the API call we use to lookup a user in Mojaloop.

<Example>

<CURL>
```bash
curl -X GET http://beta.moja-lab.live/api/fspiop/parties \
  --data '{
    "username": "my-username",
    "password": "my-password"
  }'
```
</CURL>

</Example>

</Block>