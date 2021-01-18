export default ({ router }) => {

  if (typeof window === 'undefined') {
    return;
  }

  // define redirects here
  router.addRoutes([
    { path: '/home/', redirect: '/' },
  ])
}