import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { useRouter } from 'next/router'
import { Flex } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'
import toast from 'react-hot-toast'

import AppShell from '@/components/AppShell'
import DownloadPurchaseData from '@/components/DownloadPurchaseData'
import JsonViewer from '@/components/JsonViewer'
import LoadingSpinner from '@/components/LoadingSpinner'
import SignInAlert from '@/components/SignInAlert'
import TabManager from '@/components/TabManager'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'

const Tab = () => {
  const router = useRouter()
  const [session, sessionIsLoading] = useSession()
  const [tabData, setTabData] = useState(null)

  // Fetch user's tabs
  const { data, isValidating } = useSWR(
    session ? '/v1/tabs' : null,
    fetchFromLaterpay
  )

  const onSettleTab = async tabId => {
    if (tabId) {
      const result = await fetchFromLaterpay(`/v1/payment/finish/${tabId}`, {
        method: 'post'
      })
      if (result.error) {
        toast.error(result.error.message)
      } else {
        toast.success('Tab settled')
        // resetAmountSpent()
        // Revalidate Tab data
        mutate('/v1/tabs')
        // If the user attempted to purchase a photo, redirect back to that purchase page
        if (router.query.fromPhoto) {
          router.push(`/photos/${router.query.fromPhoto}`)
        }
      }
    }
  }

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    if (router.query.tab) {
      onSettleTab(router.query.tab)
    }
    if (router.query.canceled) {
      toast.error('Tab couldn\'t be settled.')
    }
  }, [router])

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
