import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Flex } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'

import AppShell from '@/components/AppShell'
import JsonViewer from '@/components/JsonViewer'
import MyTab from '@/components/MyTab'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'

const Tab = () => {
  const [session] = useSession()
  const [tabData, setTabData] = useState(null)

  // Fetch user's tabs
  const { data } = useSWR(
    session
      ? ['/v1/tabs', session.accessToken, session.user.laterpayUserId]
      : null,
    (url, accessToken, userId) => fetchFromLaterpay(url, { accessToken, params: { user_id: userId } })
    // see https://swr.vercel.app/docs/arguments#passing-objects
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

  return (
    <AppShell>
      <Flex
        direction='column'
        justifyContent='center'
        alignItems='center'
        height='full'
        flex='1 0'
        pt={20}
        px={4}
        maxW='full'
      >
        <MyTab userId={session ? session.user.laterpayUserId : null} tabData={tabData} />
        <JsonViewer tabData={tabData} />
      </Flex>
    </AppShell>
  )
}

export default Tab
