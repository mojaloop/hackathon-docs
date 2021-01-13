import * as SDKStandardComponents from '@mojaloop/sdk-standard-components'

export interface GlobalConfig {
  currency: SDKStandardComponents.TCurrency,
  // Urls to talk to services
  urls: {
    fspiop:string,
    als: string,
    alsAdmin: string,
    centralLedger: string
  },
  // Urls to be passed into internal services
  applicationUrls: {
    oracle: string,
  },
  participants: Array<Participant>
}

export enum ParticipantType {
  DFSP = 'DFSP',
  PISP = 'PISP'
}

export interface PartyAccount {
  currency: SDKStandardComponents.TCurrency,
  description: string,
  address: string,
}
export interface Party {
  idType: string,
  idValue: string,
  displayName: string,
  firstName: string,
  middleName?: string,
  lastName: string,
  dateOfBirth: string,
  accounts?: Array<PartyAccount>
}

export type Participant = DFSPParticipant | PISPParticipant
export interface DFSPParticipant {
  id: string,
  type: ParticipantType.DFSP
  settlementAccountId: string
  simulatorAdminUrl: string,
  fspiopCallbackUrl: string,
  thirdpartyCallbackUrl: string,
  parties: Array<Party>
}

export interface PISPParticipant {
  id: string,
  type: ParticipantType.PISP
  fspiopCallbackUrl: string,
  thirdpartyCallbackUrl: string
}

// TODO: parse config with convict or something
const baseUrlAdmin = process.env.ELB_URL
const baseUrlFSPIOP = process.env.FSPIOP_URL
const scheme = `http`
const currency = 'USD'

const config: GlobalConfig = {
  currency,
  urls: {
    fspiop: `${scheme}://${baseUrlFSPIOP}`,
    als: `${scheme}://${baseUrlAdmin}/account-lookup-service`,
    alsAdmin: `${scheme}://${baseUrlAdmin}/account-lookup-service-admin`,
    centralLedger: `${scheme}://${baseUrlAdmin}/central-ledger`
  },
  applicationUrls: {
    // TODO: not sure about this one...
    oracle: `${scheme}://${baseUrlAdmin}/oracle-simulator`,
  },
  participants: [
    {
      id: 'payeefsp',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '4',
      // For our demo, Participants are on the same deployment as switch
      simulatorAdminUrl: `http://payeefsp-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://payeefsp-sdk-scheme-adapter-backend.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
        {
          displayName: "Alice Alpaca",
          firstName: "Alice",
          middleName: "K",
          lastName: "Alpaca",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "123456789"
        }
      ]
    },
    {
      id: 'applebank',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '20',
      // For our demo, Participants are on the same deployment as switch
      simulatorAdminUrl: `http://applebank-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://applebank-sdk-scheme-adapter-backend.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
        {
          displayName: "Alice Alpaca",
          firstName: "Alice",
          middleName: "K",
          lastName: "Alpaca",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "123456789"
        },
        {
          displayName: "Alex Alligator",
          firstName: "Alex",
          middleName: "A",
          lastName: "Alligator",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "11194979"
        },
      ]
    },
    {
      id: 'bananabank',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '22',
      // For our demo, Participants are on the same deployment as switch
      simulatorAdminUrl: `http://bananabank-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://bananabank-sdk-scheme-adapter-backend.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
        {
          displayName: "Bob Bobbish",
          firstName: "Bob",
          middleName: "B",
          lastName: "Bobbish",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "218493479"
        },
        {
          displayName: "Belinda Bells",
          firstName: "Belinda",
          middleName: "B",
          lastName: "Bells",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "292455793"
        }
      ]
    },
    {
      id: 'carrotmm',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '24',
      // For our demo, Participants are on the same deployment as switch
      simulatorAdminUrl: `http://carrotmm-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://carrotmm-sdk-scheme-adapter-backend.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
        {
          displayName: "Cathy C",
          firstName: "Cathy",
          middleName: "C",
          lastName: "Camera",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "32929423"
        },
        {
          displayName: "Colin Creevey",
          firstName: "Colin",
          middleName: "C",
          lastName: "Camera",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "32929124"
        }
      ]
    },
    {
      id: 'duriantech',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '26',
      // For our demo, Participants are on the same deployment as switch
      simulatorAdminUrl: `http://duriantech-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://duriantech-sdk-scheme-adapter-backend.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
        {
          displayName: "Dobby Elf",
          firstName: "Dobby",
          middleName: "E",
          lastName: "Elf",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "410283497"
        },
        {
          displayName: "Draco Dragon",
          firstName: "Draco",
          middleName: "D",
          lastName: "Dragon",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "4448483173"
        }
      ]
    },
    // TODO: register the participants

    // {
    //   id: 'dfspb',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '6',
    //   // For our demo, Participants are on the same deployment as switch
    //   simulatorAdminUrl: `${scheme}://${baseUrl}/dfspa/mojaloop-simulator/test`,
    //   fspiopCallbackUrl: `${scheme}://${baseUrl}/dfspb/sdk-scheme-adapter/inbound`,
    //   thirdpartyCallbackUrl: `${scheme}://${baseUrl}/dfspb/thirdparty-scheme-adapter/inbound`,
    //   parties: [
    //     {
    //       displayName: "Bob Babirusa",
    //       firstName: "Bob",
    //       middleName: "O",
    //       lastName: "Babirusa",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "987654321",
    //       accounts: [
    //         {
    //           currency,
    //           description: "savings",
    //           address: "moja.burgundy.76542756-f49gk439f-6a5f-543d-987654321"
    //         },
    //         {
    //           currency,
    //           description: "checkings",
    //           address: "moja.burgundy.43638980-f49gk439f-6a5f-543d-987654321"
    //         }
    //       ]
    //     }
    //   ]
    // },
  ]
}

export default config
