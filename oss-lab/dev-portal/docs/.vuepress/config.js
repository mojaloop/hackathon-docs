module.exports = {
  // theme: 'api',
  base: '/home/',
  themeConfig: {
    sidebar: [
      // '/',
      // '/page-a',
      // ['/page-b', 'Explicit link text']
      {
        title: 'Home',   // required
        path: '/',      // optional, link of the title, which should be an absolute path and must exist
        collapsable: false, // optional, defaults to true
        // sidebarDepth: 1,    // optional, defaults to 1
        children: [
          '/',
          '/0-getting-started/'
        ]
      }, 
      {
        title: 'Overview',
        path: '/1-overview/'
      },
      // '/1-overview/': 'auto',
      // {
      //   title: 'Tools',
      //   children: [ /* ... */],
      //   initialOpenGroupIndex: -1 // optional, defaults to 0, defines the index of initially opened subgroup
      // },
      {
        title: 'APIs',
        collapsable: false,
        children: [
          ['/2-apis/fspiop', 'FSPIOP (Mojaloop API)'], 
          '/2-apis/admin',
          // '/2-apis/authentication',
          '/2-apis/settlement',
          ['/2-apis/thirdparty-dfsp','Thirdparty-DFSP'],
          ['/2-apis/thirdparty-pisp','Thirdparty-PISP']

        ],
        initialOpenGroupIndex: 1 // optional, defaults to 0, defines the index of initially opened subgroup
      },
      {
        title: 'Guides',
        collapsable: false,
        children: [ 
          // No access token at the moment - maybe that's just easy for now
          // ['/3-guides/0_access_token', '0. Access Token'],
          ['/3-guides/1_dfsp_setup', '1. DFSP Setup'],
          ['/3-guides/2_dfsp_p2p', '2. P2P Transfer'],
        ],
      },
      {
        title: 'Demos',
        path: '/99-demos/'
      },
    ]
  }
}
 