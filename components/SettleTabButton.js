import { useState } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import { Button, Flex } from '@chakra-ui/react'
import toast from 'react-hot-toast'

import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'

const SettleTabButton = ({ resetAmountSpent, tabId }) => {
  const [isSettlingTab, setIsSettlingTab] = useState(false)
  const router = useRouter()

  const onSettleTab = async tabId => {
    setIsSettlingTab(true)
    if (tabId) {
      const result = await fetchFromLaterpay(`/v1/payment/finish/${tabId}`, {
        method: 'post'
      })
      if (result.error) {
        toast.error(result.error.message)
      } else {
        toast.success('Tab settled')
        resetAmountSpent()
        // Revalidate Tab data
        mutate('/v1/tabs')
        // If the user attempted to purchase a photo, redirect back to that purchase page
        if (router.query.fromPhoto) {
          router.push(`/photos/${router.query.fromPhoto}`)
        }
      }
    }
    setIsSettlingTab(false)
  }

  return (
    <Flex justify='center'>
      <Button
        isLoading={isSettlingTab}
        colorScheme='teal'
        size='lg'
        onClick={() => onSettleTab(tabId)}
      >
        Settle Your Tab
      </Button>
    </Flex>
  )
}

export default SettleTabButton
