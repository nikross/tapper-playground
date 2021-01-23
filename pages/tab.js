import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Flex, Spinner } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'

import AppShell from '@/components/AppShell'
import JsonViewer from '@/components/JsonViewer'
import SignInAlert from '@/components/SignInAlert'
import TabManager from '@/components/TabManager'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'

const Tab = () => {
  const [session, sessionIsLoading] = useSession()
  const [tabData, setTabData] = useState(null)

  // Fetch user's tabs
  const { data } = useSWR(
    session ? '/v1/tabs' : null,
    fetchFromLaterpay
  )

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

  if (sessionIsLoading) {
    return (
      <AppShell>
        <Spinner
          thickness='3px'
          speed='0.5s'
          emptyColor='gray.300'
          color='teal.400'
          size='xl'
          position='absolute'
          top='calc(50% - 1.5rem)'
          left='calc(50% - 1.5rem)'
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <Flex
        direction='column'
        justifyContent='center'
        alignItems='center'
        height='full'
        flex='1 0'
        pt={32}
        px={4}
        maxW='full'
      >
        {session
          ? (
            <>
              <TabManager tabData={tabData} />
              <JsonViewer tabData={tabData} />
            </>)
          : <SignInAlert />}
      </Flex>
    </AppShell>
  )
}

export default Tab
