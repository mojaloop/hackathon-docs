# Simulators

Refer to [mojaloop-simulator](https://github.com/mojaloop/mojaloop-simulator) on GitHub for more information on how the simulators.

## Listing all of the users for a given simulator:

```bash
curl http://<dfspid>-backend.beta.moja-lab.live/repository/parties | jq
```

Example result:
```bash
curl http://payeefsp-backend.beta.moja-lab.live/repository/parties | jq
[
  {
    "displayName": "Alice Alpaca",
    "firstName": "Alice",
    "middleName": "K",
    "lastName": "Alpaca",
    "dateOfBirth": "1970-01-01",
    "idType": "MSISDN",
    "idValue": "123456789"
  }
]

```


<!-- ## Simplified P2P Transfer

todo -->