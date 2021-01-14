# 1. DFSP Setup

This guide will help you set up your own bare-bones DFSP server to send and receive Mojaloop requests using Mojaloop's [FSPIOP API](/2-apis/fspiop/)

## 1. Prerequisites:

- A `DFSP_ID`, you can make up any set of strings you would like, e.g. `lewsdfsp`
- `node`, `npm` and `npx`
- `jq`
- `docker`

## 2. Run a Mock server to listen to async callbacks

Since Mojaloop is an Async API, we need to run a server to listen to callbacks from the Mojaloop Switch.

We use docker here to run a simple web server which prints out it's inbound requests.


```bash
docker run -p 8081:8080 --rm -t mendhak/http-https-echo:15
```

Once this server is up and running, you can test it out with the following:

```bash
curl -X POST localhost:8081 -d '{"hello":"world"}'
```

You should see the following output in the docker window:
```
-----------------
{
    "path": "/",
    "headers": {
        "host": "localhost:8081",
        "user-agent": "curl/7.74.0",
        "accept": "*/*",
        "content-length": "17",
        "content-type": "application/x-www-form-urlencoded"
    },
    "method": "POST",
    "body": "{\"hello\":\"world\"}",
    "fresh": false,
    "hostname": "localhost",
    "ip": "::ffff:172.17.0.1",
    "ips": [],
    "protocol": "http",
    "query": {},
    "subdomains": [],
    "xhr": false,
    "os": {
        "hostname": "4b1664b116cf"
    },
    "connection": {}
}
::ffff:172.17.0.1 - - [08/Jan/2021:00:11:59 +0000] "POST / HTTP/1.1" 200 486 "-" "curl/7.74.0"
```

Once you are satisfied that the docker server is running, you can then use localtunnel to expose your mock server to the public internet:

```bash
npx localtunnel --port 8081 --print-requests

# prints the following output:
#  npx: installed 35 in 2.908s
#  your url is: https://thin-mole-36.loca.lt
```

In this case, my URL is `https://thin-mole-36.loca.lt`. For the rest of this example, I will refer to this by the environment variable `MOCK_SERVER_URL`


We can now test that our localtunnel is up and running, and that we can reach the docker container with the following:


```bash
MOCK_SERVER_URL=https://thin-mole-36.loca.lt # or whatever your localtunnel prints out
curl -X POST ${MOCK_SERVER_URL} -d '{"hello":"world"}'
```

Once again you should see some logging in the docker container.


## 3. Create a new DFSP using the Admin API

Now that we have a server ready to listen to callbacks from the Mojaloop Switch, we can go ahead and register our new DFSP.

For this purpose we use the [Admin API](/2-apis/admin/), which is for Mojaloop Hub Operators and DFSPs. 

In this example I will use a `DFSP_ID` of `applebank`, but you should replace this with a `DFSP_ID` of your choosing.

> **A note about security:**  
> For the sake of this sandbox environment, we have not installed many of the security measures required for a production-grade deployment.
> This Admin API will typically be only accessed by a privileged administrator of the Mojaloop Switch, with the appropriate security measures
> to stop nefarious behavor.

```bash
# create a new participant with a currency of USD
curl -X POST http://beta.moja-lab.live/api/admin/central-ledger/participants \
    -H 'Content-Type: application/json' \
    -d '{"name":"applebank", "currency":"USD"}'
```

## 4. Fund the DFSP's accounts 

Now that our DFSP has been created, we need to set up its internal accounts.

```bash
# Set the initial position, and net debit cap
curl -X POST http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank/initialPositionAndLimits \
    -H 'Content-Type: application/json' \
    -d '{"currency":"USD", "limit": {"type":"NET_DEBIT_CAP", "value": 10000}, "initialPosition": 0}'
```

We can then get the `settlementAccountId` 

```bash
curl -H 'Content-Type: application/json' http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank | jq

# output:
# {
#   "name": "applebank",
#   "id": "dev2-central-ledger.mojaloop.live/participants/applebank",
#   "created": "\"2021-01-08T05:59:57.000Z\"",
#   "isActive": 1,
#   "links": {
#     "self": "dev2-central-ledger.mojaloop.live/participants/applebank"
#   },
#   "accounts": [
#     {
#       "id": 17,
#       "ledgerAccountType": "POSITION",
#       "currency": "USD",
#       "isActive": 1,
#       "createdDate": null,
#       "createdBy": "unknown"
#     },
#     {
#       "id": 18,
#       "ledgerAccountType": "SETTLEMENT",
#       "currency": "USD",
#       "isActive": 1,
#       "createdDate": null,
#       "createdBy": "unknown"
#     }
#   ]
# }
```

Check the output for the ledgerAccountType, and get the associated id. In my case, this is `18`.

Using the `settlementAccountId`, add some funds to the account:
> Note: you can make up your own transferId, just make sure it follows the same format!
```bash
curl -X POST http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank/accounts/18 \
    -H 'Content-Type: application/json' \
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
``` 

## 5. Register your endpoints

In order to recieve callbacks from the switch, we need to register our endpoints. Feel free to copy and paste the following script into 


```bash
DFSP_ID=applebank # your DFSP_ID you selected earlier
MOCK_SERVER_URL=https://thin-mole-36.loca.lt # or whatever your localtunnel prints out
ENDPOINTS_URL=http://beta.moja-lab.live/api/admin/central-ledger/participants/${DFSP_ID}/endpoints

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type": "FSPIOP_CALLBACK_URL_PARTICIPANT_PUT", "value": "'$MOCK_SERVER_URL'/participants/{{partyIdType}}/{{partyIdentifier}}"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type": "FSPIOP_CALLBACK_URL_PARTICIPANT_PUT_ERROR", "value": "'$MOCK_SERVER_URL'/participants/{{partyIdType}}/{{partyIdentifier}}/error"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type": "FSPIOP_CALLBACK_URL_QUOTES", "value": "'$MOCK_SERVER_URL'"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type": "FSPIOP_CALLBACK_URL_TRANSFER_POST", "value": "'$MOCK_SERVER_URL'/transfers"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type": "FSPIOP_CALLBACK_URL_TRANSFER_PUT", "value": "'$MOCK_SERVER_URL'/transfers/{{transferId}}"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type": "FSPIOP_CALLBACK_URL_TRANSFER_ERROR", "value": "'$MOCK_SERVER_URL'/transfers/{{transferId}}/error"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type": "FSPIOP_CALLBACK_URL_AUTHORIZATIONS", "value": "'$MOCK_SERVER_URL'"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type": "FSPIOP_CALLBACK_URL_TRX_REQ_SERVICE", "value": "'$MOCK_SERVER_URL'"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type":"FSPIOP_CALLBACK_URL_AUTHORIZATIONS", "value":"'$MOCK_SERVER_URL'"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type":"FSPIOP_CALLBACK_URL_PARTIES_GET", "value":"'$MOCK_SERVER_URL'/parties/{{partyIdType}}/{{partyIdentifier}}"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type":"FSPIOP_CALLBACK_URL_PARTIES_PUT", "value":"'$MOCK_SERVER_URL'/parties/{{partyIdType}}/{{partyIdentifier}}"}'

curl -X POST \
  -H 'Content-Type: application/json' \
  ${ENDPOINTS_URL} \
  -d '{"type":"FSPIOP_CALLBACK_URL_PARTIES_PUT_ERROR", "value":"'$MOCK_SERVER_URL'/parties/{{partyIdType}}/{{partyIdentifier}}/error"}'

```
Once you have registered all of the above endpoints, you can confirm that all of your endpoints were registered sucessfully: 

```bash
curl -H 'Content-Type: application/json' http://beta.moja-lab.live/api/admin/central-ledger/participants/applebank/endpoints | jq
```

## 6. Perform a Party Lookup and Check the Docker Logs:

Now that you have registered your mock server with the Mojaloop switch, you can perform a party lookup using the Mojaloop [FSPIOP API](todo)

```bash
curl -v beta.moja-lab.live/api/fspiop/parties/MSISDN/27713803912 \
  -H 'Accept: application/vnd.interoperability.parties+json;version=1' \
  -H 'Content-Type: application/vnd.interoperability.parties+json;version=1.0' \
  -H 'FSPIOP-Source: applebank' \
  -H 'Date: 2021-01-01'
```


And when we check the logs in the mock server docker container, we should see something like the following:

 
```
{
    "path": "/parties/MSISDN/27713803912",
    "headers": {
        "x-forwarded-host": "thin-mole-36.loca.lt",
        "x-forwarded-port": "80",
        "user-agent": "axios/0.20.0",
        "fspiop-signature": "{\"signature\":\"cPTiUhf_WGxK-GUBJ5YLvkXoKAGknWy8_91-F0m4pM09Afqzobd7tTzYFqRubLWja-Ug0D1exf1CBqq6dtl-px1507yRBC-nPw653XYdXVJd_JfWTQQE2g422EPLzdzeBJPKJ_PwnUZzJYF-8u0AkKRy1U16RRY2nAo5DXrZlqUF8pQu4UJzTsDyZOBHEacVKTwN1sP5fRmUZEF7KhwX2Axavvds5G0bq8sl-bNhvb_RrGpKHMSgO55GbTqDKkhjQr_YYKmYxaoayM4myjs77JF5LTttMPftRZeHUJkKwq9zWgK1cCbsOgk_oBDWhugXrk8b0mdohwp5WhjkTNOjog\",\"protectedHeader\":\"eyJhbGciOiJSUzI1NiIsIkZTUElPUC1VUkkiOiIvcGFydGllcy9NU0lTRE4vMjc3MTM4MDM5MTIiLCJGU1BJT1AtSFRUUC1NZXRob2QiOiJQVVQiLCJGU1BJT1AtU291cmNlIjoicGF5ZWVmc3AiLCJGU1BJT1AtRGVzdGluYXRpb24iOiJhcHBsZWJhbmsiLCJEYXRlIjoiRnJpLCAwOCBKYW4gMjAyMSAwNjoxMDoyNyBHTVQifQ\"}",
        "fspiop-uri": "/parties/MSISDN/27713803912",
        "fspiop-http-method": "PUT",
        "fspiop-destination": "applebank",
        "fspiop-source": "payeefsp",
        "date": "Fri, 08 Jan 2021 06:10:27 GMT",
        "content-type": "application/vnd.interoperability.parties+json;version=1.0",
        "content-length": "232",
        "connection": "close",
        "x-nginx-proxy": "true",
        "x-forwarded-proto": "https,http",
        "host": "thin-mole-36.loca.lt",
        "x-forwarded-for": "3.8.238.206,::ffff:10.42.154.6",
        "x-real-ip": "3.8.238.206"
    },
    "method": "PUT",
    "body": "{\"party\":{\"partyIdInfo\":{\"partyIdType\":\"MSISDN\",\"partyIdentifier\":\"27713803912\",\"fspId\":\"payeefsp\"},\"personalInfo\":{\"complexName\":{\"firstName\":\"Test\",\"middleName\":\"Test\",\"lastName\":\"Test\"},\"dateOfBirth\":\"1984-01-01\"},\"name\":\"Test\"}}",
    "fresh": false,
    "hostname": "thin-mole-36.loca.lt",
    "ip": "3.8.238.206",
    "ips": [
        "3.8.238.206",
        "::ffff:10.42.154.6"
    ],
    "protocol": "https",
    "query": {},
    "subdomains": [
        "thin-mole-36"
    ],
    "xhr": false,
    "os": {
        "hostname": "4b1664b116cf"
    },
    "connection": {}
}

```

So we can see that we are getting callbacks from the Mojaloop switch!



## 7. Next Steps

Congratulations on getting here! You have successfully registered your DFSP and recieved callbacks from the Mojaloop Sandbox. 

From here, you can:
1. [Perform a Peer to Peer Transaction](/3-guides/2_dfsp_p2p/)
2. [Browse the FSPIOP API](/2-apis/fspiop/)
3. [Access and use the DFSP simulator](/3-guides/3_simulators/)