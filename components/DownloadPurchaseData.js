/* global Blob */
import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons'
import { useSession } from 'next-auth/client'
import { saveAs } from 'file-saver'

import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'

const DownloadPurchaseData = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [session, sessionIsLoading] = useSession()

  if (!session || sessionIsLoading) {
    return null
  }

  const handleDownload = async (event) => {
    event.preventDefault()
    setIsDownloading(true)
    const data = await fetchFromLaterpay('/data.csv')
    const blob = new Blob([`${data}`], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, 'data.csv')
    setIsDownloading(false)
  }

  return (
    <Button
      as='a'
      href='/api/laterpay/data.csv'
      download
      isLoading={isDownloading}
      variant='ghost'
      color='gray.500'
      size='lg'
      leftIcon={<DownloadIcon />}
      _hover={{
        bg: 'gray.200',
        color: 'gray.700'
      }}
      onClick={e => handleDownload(e)}
    >
      Download purchase data
    </Button>
  )
}

export default DownloadPurchaseData
