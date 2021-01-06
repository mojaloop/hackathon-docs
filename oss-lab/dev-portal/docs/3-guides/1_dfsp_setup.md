# 1. DFSP Setup

This guide will help you set up your own bare-bones DFSP server to send and receive Mojaloop requests using Mojaloop's [FSPIOP API](/2-apis/fspiop/)

## Prerequisites:

- Your DFSP_ID, this will be assigned to you
- `localtunnel` 
- `sdk-scheme-adapter` ?? - [todo - or should we make some sort of 'starter kit'?]
  - or can we run a super simple server to get callbacks from the switch?

- `docker run -p 8081:8080 -p 8443:8443 --rm -t mendhak/http-https-echo:15`

<Block>

## Run a Mock server to listen to async callbacks

In this step, we run a simple web server to listen to callbacks 


```bash
docker run -p 8081:8080 -p 8443:8443 --rm -t mendhak/http-https-echo:15
npx localtunnel --port 8081 --print-requests

# prints:
#  your url is: https://curvy-panda-37.loca.lt


# now try curling the localtunnel, and check the docker logs
curl -X POST https://curvy-panda-37.loca.lt -d '{"hello":true}'
```

## Create a new DFSP and set it up 
```bash
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

#TODO: flesh out this list

curl -X POST \
  -H 'Content-Type: application/json' \
  http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank/endpoints \
  -d '{"type":"FSPIOP_CALLBACK_URL_AUTHORIZATIONS", "value":"https://curvy-panda-37.loca.lt"}'


curl -X POST \
  -H 'Content-Type: application/json' \
  http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank/endpoints \
  -d '{"type":"FSPIOP_CALLBACK_URL_PARTIES_GET", "value":"https://curvy-panda-37.loca.lt/parties/{{partyIdType}}/{{partyIdentifier}}"}'


curl -X POST \
  -H 'Content-Type: application/json' \
  http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank/endpoints \
  -d '{"type":"FSPIOP_CALLBACK_URL_PARTIES_PUT", "value":"https://curvy-panda-37.loca.lt/parties/{{partyIdType}}/{{partyIdentifier}}"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank/endpoints \
  -d '{"type":"FSPIOP_CALLBACK_URL_PARTIES_PUT_ERROR", "value":"https://curvy-panda-37.loca.lt/parties/{{partyIdType}}/{{partyIdentifier}}/error"}'



# you can confirm that all of your endpoints were registered sucessfully
curl -H 'Content-Type: application/json' http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank/endpoints | jq



```

## Perform a Party Lookup and Check the Docker Logs:

```bash
curl -v beta.moja-lab.live/api/fspiop/parties/MSISDN/123456789 \
  -H 'Accept: application/vnd.interoperability.parties+json;version=1' \
  -H 'Content-Type: application/vnd.interoperability.parties+json;version=1.0' \
  -H 'FSPIOP-Source: applebank' \
  -H 'Date: 2021-01-01'

```

checking the logs on our docker container gives us the following:


```
{
    "path": "/parties/MSISDN/213/error",
    "headers": {
        "fspiop-signature": "{\"signature\":\"ZuHtpoP3wrSR3NU2dxW2XGfC8xDEnIM0uqDoAllrDQuCrRmo3RgXbdowegdvQDeZUWURjtyY38OhKOVPPgO5Ghzcuj6xJzf96aTaqFe3Oq21Ry1bIx9HNGIZfaerRbOMqEGrwICKwC-mHYdl23DkiTnOsQBjU9iu9xcWkB0AHmt7bZhs2efKfD6utwjyt391pvjWshSF1Ma-rkbxVD2JiZ0hj_ewuY1dXEy-HD3zlcgjP0RbRXmlZWVUG06DdUGeMCzGiw1TAKwkU33oRnjaF9A8xuVGkfBJAkPBvjuRsvrNkNvIuU6rHd2_4jBFC3F3OtXsTSwJpUcYrQkHn6WCIg\",\"protectedHeader\":\"eyJhbGciOiJSUzI1NiIsIkZTUElPUC1VUkkiOiIvcGFydGllcy9NU0lTRE4vMjEzL2Vycm9yIiwiRlNQSU9QLUhUVFAtTWV0aG9kIjoiUFVUIiwiRlNQSU9QLVNvdXJjZSI6InN3aXRjaCIsIkZTUElPUC1EZXN0aW5hdGlvbiI6ImFwcGxlYmFuayIsIkRhdGUiOiJGcmksIDAxIEphbiAyMDIxIDAwOjAwOjAwIEdNVCJ9\"}",
        "fspiop-uri": "/parties/MSISDN/213/error",
        "fspiop-http-method": "PUT",
        "fspiop-destination": "applebank",
        "date": "Fri, 01 Jan 2021 00:00:00 GMT",
        "fspiop-source": "switch",
        "user-agent": "curl/7.74.0",
        "x-forwarded-path": "/api/fspiop/parties/MSISDN/213",
        "x-forwarded-port": "80,80",
        "x-forwarded-host": "beta.moja-lab.live",
        "content-type": "application/vnd.interoperability.parties+json;version=1.0",
        "content-length": "78",
        "connection": "close",
        "x-nginx-proxy": "true",
        "x-forwarded-proto": "https,http",
        "host": "curvy-panda-37.loca.lt",
        "x-forwarded-for": "10.42.12.0, 35.177.147.156,::ffff:10.42.154.6",
        "x-real-ip": "35.177.147.156"
    },
    "method": "PUT",
    "body": "{\"errorInformation\":{\"errorCode\":\"3204\",\"errorDescription\":\"Party not found\"}}",
    "fresh": false,
    "hostname": "beta.moja-lab.live",
    "ip": "35.177.147.156",
    "ips": [
        "35.177.147.156",
        "::ffff:10.42.154.6"
    ],
    "protocol": "https",
    "query": {},
    "subdomains": [
        "beta"
    ],
    "xhr": false,
    "os": {
        "hostname": "7365346f94d0"
    },
    "connection": {}
}
```

So we can see that we are getting callbacks from the Mojaloop switch! The next step is to look up a party that actually exists!


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