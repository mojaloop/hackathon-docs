# Simulators

Refer to [mojaloop-simulator](https://github.com/mojaloop/mojaloop-simulator) on GitHub for more information on how the simulators.


This sandbox deploys simulators which allow you to:
1. Browse users registered with a DFSP
2. Send from one Party to another in a simple interface
## 1. Set up the Simulator UI(s)

1. Navigate to the Simulator UI page at http://simulator-ui.beta.moja-lab.live
2. Select "Settings" in the left bar

## 2. Register a DFSP Backend and check the users list

The Simulators


For example, you can register the Applebank Simulator Backend

- name: `applebank1`
- protocol: `http`
- host: `applebank-backend.moja-lab.live`
- port: `80`

And hit "Save"

Once you've created that config, make sure to select it in the "Current Setting" in the dropdown

![](todo)

Now you can navigate back to the list of users, and reload your browser. You should see a user list similar to the following:

![](todo)

## 3. Send a Transfer

1. Select "Outbound Send" on the left menu.

2. Leave the editor in "Simple Mode"


3. Leave all the fields the same except for the last, and change this to be a MSISDN you can find in 
## Handy Snippets:
### Listing all of the users for a given simulator:

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