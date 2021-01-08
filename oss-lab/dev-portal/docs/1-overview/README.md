---
title: Overview
---


# Overview

This Mojaloop Sandbox is an open environment for playing around with Mojaloop.

All services use the base url `http://beta.moja-lab.live`



## What's included in Environment?

Out of the box, this environment includes the following simulated DFSPs

[todo - nice pretty picture]

### DFSPs

- `applebank`
- `bananabank`
- `carrotmoney`
- `durianfintech`

### Users

[todo - MSISDNs etc.]


e.g. 

You can play around with the existing DFSPs


## APIs

Mojaloop has a variety of APIs you can interact with:

| Name | Version | Who | Base URL |
| --- | --- | --- | --- |
| [FSPIOP (Mojaloop API)](/2-apis/fspiop)     | `v1.1` | DFSPs             | `beta.moja-lab.live/api/fspiop` |
| [Admin](2-apis/admin)                       | `v1`   | Hub Admins, DFSPs | `beta.moja-lab.live/api/admin/central-ledger` |
| [Settlement](2-apis/settlement.html)        | `v1`   | DFSPs             | (not currently available with this lab) |
| [Thirdparty-DFSP](/2-apis/thirdparty-dfsp)  | `v0.1` | DFSPs             | todo |
| [Thirdparty-PISP](/2-apis/thirdparty-pisp)  | `v0.1` | PISPs             | todo | 

Q.D_v0FnvRS7dku&Zv'{qE4}c

## Tools:

This sandbox includes the following tools 


- [Sandbox Dev Hub](http://beta.moja-lab.live/home/0-getting-started)
- [Mojaloop Testing Toolkit](todo)
- [Simulator UI](http://simulator-ui.beta.moja-lab.live) - for more information on using the simulator-ui, refer to [this external guide]()

<!-- ## Understanding Async APIs -->
<!--  -->
<!-- The Mojaloop APIs follow an asychronous pattern. -->

## Helpful Links

- [Mojaloop Documentation](https://docs.mojaloop.io/documentation/)
- [Mojaloop API Specification v1.0](https://docs.mojaloop.io/mojaloop-specification/documents/API%20Definition%20v1.0.html)
- [Mojaloop API OpenAPI (Swagger)](https://github.com/mojaloop/mojaloop-specification/blob/master/fspiop-api/documents/v1.1-document-set/)

