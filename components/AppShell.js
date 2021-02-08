import Head from 'next/head'
import { Box } from '@chakra-ui/react'
import Header from '@/components/Header'
// import Footer from '@/components/Footer'

const AppShell = ({ children }) => {
  return (
    <>
      <Head>
        <title>Tapper Playground</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Box py={20}>
        {children}
      </Box>
      {/* <Footer /> */}
    </>
  )
}

export default AppShell
