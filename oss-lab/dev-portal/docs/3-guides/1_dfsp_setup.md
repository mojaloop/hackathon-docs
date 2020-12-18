# 1. DFSP Setup

This guide will help you set up your own bare-bones DFSP server to send and receive Mojaloop requests using Mojaloop's [FSPIOP API](/2-apis/fspiop/)

## Prerequisites:

- `localtunnel` 
- `sdk-scheme-adapter` ?? - [todo - or should we make some sort of 'starter kit'?]
  - or can we run a super simple server to get callbacks from the switch?


<Block>

## Enrol your DFSP

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