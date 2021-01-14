# Trying out the Thirdparty API Locally

The Thirdparty API (PISP API) is still in preview mode, but that doesn't mean you can't use it to build against!

This guide walks you through how to run the testing toolkit locally to support the Thirdparty API.

## Prerequisites

- Command line access on a machine
- A Browser
- `docker` and `docker-compose`, any recent version should work

## 1. Clone the PISP Repo

Go to [github.com/mojaloop/pisp](https://github.com/mojaloop/pisp). This is where a lot of the in progress work for pisp is taking place.

Clone the repo however you'd like, for example:
```bash
git clone https://github.com/mojaloop/pisp.git
```

Once that is complete, cd into the `./pisp/docker-contract` directory

```bash
cd ./pisp/docker-contract
```

## 2. Run `docker-compose up`

In this folder, we maintain a pre-configured testing toolkit that supports the PISP APIs that we run tests against.

Start the containers like so

```bash
docker-compose up
```
![](./pisp_dcu.png)

And wait for docker to download and run the containers. This may take a little while depending on your connection speed.

You should see some output similar to the following:

![](./pisp_dcu_done.png)


## 3. Browse the Locally Running Testing Toolkit

The Testing Toolkit UI will be up and running at [localhost:6060](http://localhost:6060)

Go to the "monitoring" tab to watch the requests as they come in.


## 4. Configure a callback server

We a way to inspect the callbacks from the Testing Toolkit. In your production app, this would be pointed to your application, but for this example we can just log the requests.

We can use docker to run a simple web server which prints out its inbound requests.

Open `./pisp/docker-contract/docker-compose.yml`, and add a new service on line `8`:

```yaml
...

services:
  callback-server:
    image: mendhak/http-https-echo:15
    networks:
      - mojaloop-pisp-net
    ports:
      - 8081:8080

  ml-testing-toolkit:
    image: mojaloop/ml-testing-toolkit:v11.1.1
    container_name: dl_ml-testing-toolkit
  ...

```

Save and close the file, and restart your docker-compose:

`docker-compose up`


You can check the logs for the `callback-server` in a separate window with the following command:
```bash
docker-compose logs -f callback-server 
```


Now we need to confgure the testing toolkit to use the correct callback url.

Go to [`localhost:6060/admin/settings`](http://localhost:6060/admin/settings) and look for the `Callback URL` field.

Change this to `http://callback-server:8080`

![](./pisp_callback.png)


## 5. Call the Thirdparty APIs!

You can now start using the Thirdparty APIs

The API is divided into 2 sections:
- [`Thirdparty-PISP`](http://beta.moja-lab.live/2-apis/thirdparty-pisp.html) for the PISP side of the transaction
- [`Thirdparty-DFSP`](http://beta.moja-lab.live/2-apis/thirdparty-dfsp.html) for an existing DFSP to support PISP's features

To start with, you most likely will want to be using the `Thirdparty-PISP` API.

To understand how a PISP tranfer works, check out the [PISP Transfer documentation here](https://github.com/mojaloop/pisp/blob/master/docs/transfer/README.md) 


<!-- ### 5.1 Party Lookup:
![](./pisp_lookup.png)

[todo] -->


### 5.1 `POST /thirdpartyRequests/transactions`
![](./pisp_txreq.png)

```bash
curl -X POST http://localhost:15000/thirdpartyRequests/transactions \
  -H 'Accept: application/vnd.thirdparty.transactions+json;version=1.0' \
  -H 'Content-Type: application/vnd.thirdparty.transactions+json;version=1.0' \
  -H 'Date: Mon, 11 Jan 2021 00:00:00 GMT' \
  -H 'FSPIOP-Source: pispa' \
  -H 'FSPIOP-Destination: dfspa' \
  -d '{
  "sourceAccountId": "mats_account.dfspa.123",
  "consentId": "387ee6b9-520d-4c51-a9e4-6eb2ef15123a",
  "transactionRequestId": "387ee6b9-520d-4c51-a9e4-6eb2ef15887a",
  "payer": {
    "partyIdInfo": {
      "partyIdType": "MSISDN",
      "partyIdentifier": "947947947947",
      "fspId": "applebank"
    },
    "personalInfo": {
      "complexName": {
        "firstName": "Mats",
        "lastName": "Hagman"
      },
      "dateOfBirth": "1983-10-25"
    }
  },
  "payee": {
    "partyIdInfo": {
      "partyIdType": "MSISDN",
      "partyIdentifier": "27713803912",
      "fspId": "payeefsp"
    }
  },
  "amountType": "SEND",
  "amount": {
    "amount": "10",
    "currency": "USD"
  },
  "transactionType": {
    "scenario": "TRANSFER",
    "initiator": "PAYER",
    "initiatorType": "CONSUMER"
  },
  "expiration": "2021-01-30T00:00:00.000"
}'
```

Example Response (in `docker-compose logs -f callback-server`)
```
callback-server_1          | -----------------
callback-server_1          | {
callback-server_1          |     "path": "/thirdpartyRequests/transactions/387ee6b9-520d-4c51-a9e4-6eb2ef15887a",
callback-server_1          |     "headers": {
callback-server_1          |         "content-type": "application/vnd.interoperability.thirdparty+json;version=1.0",
callback-server_1          |         "accept": "application/vnd.interoperability.thirdparty+json;version=1.0",
callback-server_1          |         "date": "Wed, 27 May 2020 11:13:34 GMT",
callback-server_1          |         "fspiop-source": "DFSPA",
callback-server_1          |         "traceparent": "00-ccdd3b81b37b30461aeffbe5a230d0-0123456789abcdef0-00",
callback-server_1          |         "user-agent": "axios/0.19.2",
callback-server_1          |         "content-length": "93",
callback-server_1          |         "host": "callback-server:8080",
callback-server_1          |         "connection": "close"
callback-server_1          |     },
callback-server_1          |     "method": "PUT",
callback-server_1          |     "body": "{\"transactionId\":\"5a2ad5dc-4ab1-4a22-8c5b-62f75252a8d5\",\"transactionRequestState\":\"RECEIVED\"}",
callback-server_1          |     "fresh": false,
callback-server_1          |     "hostname": "callback-server",
callback-server_1          |     "ip": "::ffff:172.19.0.4",
callback-server_1          |     "ips": [],
callback-server_1          |     "protocol": "http",
callback-server_1          |     "query": {},
callback-server_1          |     "subdomains": [],
callback-server_1          |     "xhr": false,
callback-server_1          |     "os": {
callback-server_1          |         "hostname": "2801806352fc"
callback-server_1          |     },
callback-server_1          |     "connection": {}
callback-server_1          | }
callback-server_1          | ::ffff:172.19.0.4 - - [14/Jan/2021:12:16:19 +0000] "PUT /thirdpartyRequests/transactions/387ee6b9-520d-4c51-a9e4-6eb2ef15887a HTTP/1.1" 200 909 "-" "axios/0.19.2"
```

Example Body:
```json
{
  "transactionId":"5a2ad5dc-4ab1-4a22-8c5b-62f75252a8d5",
  "transactionRequestState":"RECEIVED"
}
```

You can see that the transaction request was accepted by the DFSP!


> Note: There should then be a `POST /authorizations` from the DFSP -> PISP as a part of this flow, but that is currently broken in this config.


<!-- ### 5.3 `PUT/authorizations/123`
![](./pisp_put_auth.png) -->
