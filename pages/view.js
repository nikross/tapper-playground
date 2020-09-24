import { useEffect, useState } from 'react'
import Head from 'next/head'
import Footer from '../components/Footer'
import styles from '../styles/Home.module.css'
import { getUserId, handleSigninUser } from '../utils/manage-user-id'

const ViewTab = () => {
  const [userId, setUserId] = useState(null)
  useEffect(() => {
    const id = getUserId()
    setUserId(id)
  }, [])
  const changeUserId = () => {
    const newUserId = handleSigninUser()
    setUserId(newUserId)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>My Tab</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          My Tab
        </h1>

        <p className={styles.description}>
          Logged in as
          {<code className={styles.code}>{userId}</code>}
          <button onClick={() => changeUserId()}>
            Change
          </button>
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default ViewTab
