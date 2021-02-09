import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Flex } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'

import AppShell from '@/components/AppShell'
import DownloadPurchaseData from '@/components/DownloadPurchaseData'
import JsonViewer from '@/components/JsonViewer'
import LoadingSpinner from '@/components/LoadingSpinner'
import SignInAlert from '@/components/SignInAlert'
import TabManager from '@/components/TabManager'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'

const Tab = () => {
  const [session, sessionIsLoading] = useSession()
  const [tabData, setTabData] = useState(null)

  // Fetch user's tabs
  const { data, isValidating } = useSWR(
    session ? '/v1/tabs' : null,
    fetchFromLaterpay
  )

  useEffect(() => {
    if (data && data.length) {
      const currentTab =
        data.find(tab => tab.status === 'full' && !!tab.merchant_id) ||
        data.find(tab => tab.status === 'open' && !!tab.merchant_id) ||
        {}
      setTabData(currentTab)
    }
  }, [data])

  if (sessionIsLoading) {
    return (
      <AppShell>
        <LoadingSpinner />
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
        pt={{ base: 8, md: 32 }}
        px={4}
        maxW='full'
      >
        {session
          ? (
            <>
              <TabManager tabData={tabData} isValidating={isValidating} />
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                align='center'
                justify='space-between'
                py={6}
                minH={12}
                w='700px'
                maxW='full'
              >
                <DownloadPurchaseData />
                <JsonViewer tabData={tabData} />
              </Flex>
            </>)
          : <SignInAlert />}
      </Flex>
    </AppShell>
  )
}

export default Tab
