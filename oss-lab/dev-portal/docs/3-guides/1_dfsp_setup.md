# 1. DFSP Setup

This guide will help you set up your own bare-bones DFSP server to send and receive Mojaloop requests using Mojaloop's [FSPIOP API](/2-apis/fspiop/)

## Prerequisites:

- A DFSP_ID, this will be assigned to you
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

# register your endpoints with the hub


http://beta.moja-lab.live/api/admin/central-ledger


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