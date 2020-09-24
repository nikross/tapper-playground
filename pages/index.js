import Head from 'next/head'
import Link from 'next/link'
import fetch from 'node-fetch'
import styles from '../styles/Home.module.css'
import Footer from '../components/Footer'

const Home = ({ lpApiStatus }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tapper Playground</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the Tapper Playground
        </h1>

        <p className={styles.description}>
          Laterpay API Status:
          <code className={styles.code}>{lpApiStatus || 'fetch failed'}</code>
        </p>

        <div className={styles.grid}>
          <Link href='/view'>
            <a className={styles.card}>
              <h3>View Your Tab &rarr;</h3>
              <p>Check how much you've spent.</p>
            </a>
          </Link>

          <a href='https://nextjs.org/learn' className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          {/* <a
            href='https://github.com/vercel/next.js/tree/master/examples'
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href='https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a> */}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export async function getServerSideProps (context) {
  // Fetch data from Laterpay API
  const res = await fetch('https://tapi.sbx.laterpay.net/health')
  const data = await res.json()
  return {
    props: { // will be passed to the page component as props
      lpApiStatus: data && data.status
    }
  }
}

export default Home
