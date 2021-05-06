module.exports = {
  // theme: 'api',
  // base: '/home/',
  base: '/',
  themeConfig: {
    logo: '/mojaloop_logo_med.png',
    sidebar: [
      {
        title: 'Getting Started',
        path: '/',
        collapsable: false,
      }, 
      {
        //TODO: can we make this so it's always expanded?
        title: 'Overview',
        path: '/1-overview/',
      },
      {
        title: 'APIs',
        collapsable: false,
        children: [
          ['/2-apis/fspiop', 'FSPIOP (Mojaloop API)'], 
          ['/2-apis/admin', 'Admin API'],
          ['/2-apis/settlement', 'Settlement API'],
          ['/2-apis/thirdparty-dfsp','Thirdparty-DFSP'],
          ['/2-apis/thirdparty-pisp','Thirdparty-PISP']

        ],
        initialOpenGroupIndex: 1
      },
      {
        title: 'Guides',
        collapsable: false,
        children: [ 
          // No access token at the moment - maybe that's just easy for now
          // ['/3-guides/0_access_token', '0. Access Token'],
          ['/3-guides/1_dfsp_setup', '1. DFSP Setup'],
          ['/3-guides/2_dfsp_p2p', '2. P2P Transfer'],
          ['/3-guides/3_simulators', '3. DFSP Simulators'],
          ['/3-guides/5_ttk_p2p', '4. TTK P2P Transfer (Easy)'],
          ['/3-guides/6_pisp_local', '5. Thirdparty PISP API Local'],
        ],
      },
      {
        title: 'Demos',
        path: '/99-demos/'
      },
    ]
  }
}
 