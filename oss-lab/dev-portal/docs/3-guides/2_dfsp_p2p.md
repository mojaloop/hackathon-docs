# 2. Peer to Peer Transaction

This guide takes you through the process of issuing a Peer to Peer (P2P) transaction from your DFSP to another DFSP.

<!-- TODO: nice pretty picture -->
A Mojaloop Transaction takes 3 distict phases: 
1. Party Lookup
2. Quoting
3. Transfer


## Prerequisites

- Completed the [DFSP setup guide](/3-guides/1_dfsp_setup) and are succesfully recieving callbacks from the Mojaloop Sandbox

</br>
---



## Party Lookup

```
GET /parties/{Type}/{ID}
```

The party lookup phase is where we lookup an identifier provided by _your end user_, and find out more information about the person that your user wants to send funds to. In the real world after recieiving the `PUT /parties/{Type}/{ID}` callback response from the Mojaloop switch, you will confirm the data with your end user. 



```bash
curl -v beta.moja-lab.live/api/fspiop/parties/MSISDN/27713803912 \
  -H 'Accept: application/vnd.interoperability.parties+json;version=1' \
  -H 'Content-Type: application/vnd.interoperability.parties+json;version=1.0' \
  -H 'FSPIOP-Source: applebank' \
  -H 'Date: 2021-01-01'
```

**Callback:**
`PUT /parties/MSISDN/27713803912`
```json
{
  "party": {
    "partyIdInfo": {
      "partyIdType": "MSISDN",
      "partyIdentifier": "27713803912",
      "fspId": "payeefsp"
    },
    "personalInfo": {
      "complexName": {
        "firstName": "Test",
        "middleName": "Test",
        "lastName": "Test"
      },
      "dateOfBirth": "1984-01-01"
    },
    "name": "Test"
  }
}
```

## Quote

[todo ]

```
POST /quotes
```

After your user has confirmed the details of the end user, it's time to get a quote from the Payer DFSP about the fees associated with the transaction.

You can ask your user either _"How much money do you want to send?"_ or _"How much money would you like the receiver to receive?"_. In this example, we will the `RECEIVE_AMOUNT`, which is to say _"How much money would you like the receiver to receive?"_.

After receiving the quote response callback at `PUT /quotes/{ID}`, you can then inform your user of the fees associated with the transaction, and ask them whether or not they would liike to 



```bash
curl -X POST http://beta.moja-lab.live/api/fspiop/quotes \
  --data '{
    "todo": "example fields!",
    "username": "my-username",
    "password": "my-password"
  }'
```

**Callback:**
`PUT /quotes/{ID}`
```json
{
  "response": "this is a sample response"
}
```

## Transfer

```
POST /transfers
```
Once you have confirmed the transaction details with your end user, and they have confirmed they would like to proceed with the transaction, you can issue a `POST /tranfers`. 

This request moves the funds from your users account to the Payee user.



```bash
curl -X POST http://beta.moja-lab.live/api/fspiop/transfers \
  --data '{
    "todo": "example fields!",
    "username": "my-username",
    "password": "my-password"
  }'
```

**Callback:**
`PUT /transfers/{ID}`
```json
{
  "response": "this is a sample response"
}
```

