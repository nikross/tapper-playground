import { useEffect, useState } from 'react'
import Head from 'next/head'
// import Link from 'next/link'
import useSWR from 'swr'
import { Flex } from '@chakra-ui/react'
// import styles from '../styles/Home.module.css'
import JsonViewer from '../components/JsonViewer'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MyTab from '../components/MyTab'
import fetchThroughInternalApi from '../utils/fetch-through-internal-api'
import { handleUserSignin, handleUserSignout, retrieveUserIdFromStorage } from '../utils/manage-user'
// import { getTabForUser } from '../lib/manage-tab'

const Home = ({ lpApiStatus }) => {
  const [userId, setUserId] = useState(null)
  const [tabData, setTabData] = useState(null)

  // Fetch tab list
  const { data } = useSWR(
    userId ? [`/v1/tabs/list/${userId}`] : null,
    fetchThroughInternalApi
  )

  useEffect(() => {
    // Try getting user ID from session storage
    const storedUserId = retrieveUserIdFromStorage()
    if (storedUserId) setUserId(storedUserId)
  }, [])

  useEffect(() => {
    if (data) {
      const allTabs = Object.values(data)
      const currentTab =
        allTabs.find(tab => tab.status === 'full') ||
        allTabs.find(tab => tab.status === 'open') ||
        {}
      setTabData(currentTab)
    }
  }, [data])

  const handleUserIdChange = () => {
    const newUserId = userId ? handleUserSignout() : handleUserSignin()
    setUserId(newUserId)
    if (!newUserId) setTabData(null)
  }
  return (
    <>
      <Head>
        <title>Tapper Playground</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header
        userId={userId}
        onButtonClick={() => handleUserIdChange()}
      />
      <Flex
        bg='gray.100'
        minH='100vh'
        pt={24}
        direction='column'
        justify='center'
        align='center'
      >
        <Flex
          direction='column'
          justifyContent='center'
          alignItems='center'
          height='full'
          flex='1 0'
          px={4}
          maxW='full'
        >
          <MyTab userId={userId} tabData={tabData} />
          <JsonViewer tabData={tabData} />
        </Flex>
        <Footer />
      </Flex>
    </>
  )
}

export default Home
