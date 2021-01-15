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
    //disabled for now, enokimm name is too long
    // {
    //   id: 'enokimm',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '26',
    //   // Not sure if this will work...
    //   simulatorAdminUrl: `http://enokimm-backend.beta.moja-lab.live`,
    //   fspiopCallbackUrl: `http://enokimm-ttk-backend-fspiop.beta.moja-lab.live`,
    //   thirdpartyCallbackUrl: `n/a`,
    //   parties: [
    //     {
    //       displayName: "Edwin E",
    //       firstName: "Edwin",
    //       middleName: "E",
    //       lastName: "Enoki",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "555111222"
    //     },
    //     {
    //       displayName: "Eric Elmo",
    //       firstName: "Eric",
    //       middleName: "E",
    //       lastName: "Elmo",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "55512345"
    //     },
    //   ]
    // }, 
    {
      id: 'figmm',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '28',
      // Not sure if this will work...
      simulatorAdminUrl: `http://figmm-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://figmm-ttk-backend-fspiop.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
      ]
    },
    {
      id: 'ppmm',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '48',
      // Not sure if this will work...
      simulatorAdminUrl: `http://ppmm-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://ppmm-ttk-backend-fspiop.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
        {
          displayName: "Edwin E",
          firstName: "Edwin",
          middleName: "E",
          lastName: "Enoki",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "555111222"
        },
        {
          displayName: "Eric Elmo",
          firstName: "Eric",
          middleName: "E",
          lastName: "Elmo",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "55512345"
        },
      ]
    },
    {
      id: 'eggmm',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '34',
      // Not sure if this will work...
      simulatorAdminUrl: `http://eggmm-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://eggmm-ttk-backend-fspiop.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
      ]
    },
    // {
    //   id: 'applebank',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '18',
    //   simulatorAdminUrl: `http://applebank-backend.beta.moja-lab.live`,
    //   fspiopCallbackUrl: `http://mojaloop-sim-applebank-scheme-adapter:4000`,
    //   thirdpartyCallbackUrl: `n/a`,
    //   parties: [
    //     {
    //       displayName: "Alice Alpaca",
    //       firstName: "Alice",
    //       middleName: "K",
    //       lastName: "Alpaca",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "123456789"
    //     },
    //     {
    //       displayName: "Alex Alligator",
    //       firstName: "Alex",
    //       middleName: "A",
    //       lastName: "Alligator",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "11194979"
    //     },
    //   ]
    // },
    // {
    //   id: 'bananabank',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '20',
    //   // For our demo, Participants are on the same deployment as switch
    //   simulatorAdminUrl: `http://bananabank-backend.beta.moja-lab.live`,
    //   fspiopCallbackUrl: `http://mojaloop-sim-bananabank-scheme-adapter:4000`,
    //   thirdpartyCallbackUrl: `n/a`,
    //   parties: [
    //     {
    //       displayName: "Bob Bobbish",
    //       firstName: "Bob",
    //       middleName: "B",
    //       lastName: "Bobbish",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "218493479"
    //     },
    //     {
    //       displayName: "Belinda Bells",
    //       firstName: "Belinda",
    //       middleName: "B",
    //       lastName: "Bells",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "292455793"
    //     }
    //   ]
    // },
    // {
    //   id: 'carrotmm',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '22',
    //   // For our demo, Participants are on the same deployment as switch
    //   simulatorAdminUrl: `http://carrotmm-backend.beta.moja-lab.live`,
    //   fspiopCallbackUrl: `http://mojaloop-sim-carrotmm-scheme-adapter:4000`,
    //   thirdpartyCallbackUrl: `n/a`,
    //   parties: [
    //     {
    //       displayName: "Cathy C",
    //       firstName: "Cathy",
    //       middleName: "C",
    //       lastName: "Camera",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "32929423"
    //     },
    //     {
    //       displayName: "Colin Creevey",
    //       firstName: "Colin",
    //       middleName: "C",
    //       lastName: "Camera",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "32929124"
    //     }
    //   ]
    // },
    // {
    //   id: 'duriantech',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '24',
    //   // For our demo, Participants are on the same deployment as switch
    //   simulatorAdminUrl: `http://duriantech-backend.beta.moja-lab.live`,
    //   fspiopCallbackUrl: `http://mojaloop-sim-duriantech-scheme-adapter:4000`,
    //   thirdpartyCallbackUrl: `n/a`,
    //   parties: [
    //     {
    //       displayName: "Dobby Elf",
    //       firstName: "Dobby",
    //       middleName: "E",
    //       lastName: "Elf",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "410283497"
    //     },
    //     {
    //       displayName: "Draco Dragon",
    //       firstName: "Draco",
    //       middleName: "D",
    //       lastName: "Dragon",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "4448483173"
    //     }
    //   ]
    // },
  ]
}

export default config
