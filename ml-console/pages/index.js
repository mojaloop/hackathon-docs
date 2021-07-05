import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
// import cookieCutter from 'cookie-cutter'

import { parseCookies, setCookie, destroyCookie } from 'nookies'

export default function Home() {
  let isLoggedIn = false;

  const cookies = parseCookies();
  console.log('cookies are', cookies);

  // const oryCookie = cookieCutter.get('ory_kratos_session');
  // if (oryCookie) {
  //   isLoggedIn = true
  //   console.log('we are logged in!')
  // }

  // Set
  // setCookie(null, 'fromClient', 'value', {
  //   maxAge: 30 * 24 * 60 * 60,
  //   path: '/',
  // })

  const result = fetch('http://127.0.0.1:4433/sessions/whoami')

  return (
    // <div className={styles.container}>
    <div>
      <header>
        { 
          isLoggedIn ? 
          <a href="http://127.0.0.1:4433/self-service/browser/flows/logout">
            Logout
          </a>
          :
          <a href="http://127.0.0.1:4433/self-service/login/browser">
            Sign in
          </a>
        }
      </header>

      <Head>
        <title>Mojaloop Console</title>
        <meta name="description" content="Mojaloop Console" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Mojaloop
        </h1>

        <div>
          <h2>My User:</h2>

          <p>userId: <strong>todo</strong></p>
          <p>token: <strong>todo</strong></p>
        </div>

        {/* <div>
          <h2>My PISP:</h2>
          <p>pispId: <strong>pineapplepay</strong></p>
          <p>callbackBaseUrl: <strong></strong></p>
        </div> */}



        {/* <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}
