import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Stack
} from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'
import { useSession, signIn } from 'next-auth/client'
import { mutate } from 'swr'
import toast from 'react-hot-toast'

import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'
import { numberToPrice } from '@/utils/price'

const Paywall = ({ offeringId, photo }) => {
  const router = useRouter()
  const [session] = useSession()
  const [isPurchasing, setIsPurchasing] = useState(null)

  const onPurchase = async () => {
    setIsPurchasing(true)
    const result = await fetchFromLaterpay('/v1/purchase', {
      method: 'post',
      data: {
        offering_id: offeringId,
        summary: photo.title,
        price: {
          amount: photo.price,
          currency: 'USD'
        },
        sales_model: 'single_purchase'
      }
    })
    if (result.tab) {
      const { limit, status, total } = result.tab
      const success = status === 'open'
      if (success) {
        toast.success(`${numberToPrice(limit - total, 'USD')} remaining on your Tab`)
        // Revalidate access data
        mutate(
          ['/v1/access', offeringId],
          data => ({
            access: { ...data.access, has_access: true }
          })
        )
      } else {
        toast.error('Please settle your Tab')
        router.push(`/tab?fromPhoto=${photo.id}`)
      }
    }
    setIsPurchasing(false)
  }

  return (
    <Stack
      alignItems='center'
      spacing={6}
      w='full'
      position='absolute'
      top='calc(50% - 5rem)'
    >
      <LockIcon
        boxSize='5rem'
        color='teal.500'
        opacity='.5'
      />
      <Button
        colorScheme='teal'
        size='lg'
        isLoading={isPurchasing}
        onClick={() => session ? onPurchase() : signIn('laterpay')}
      >
        {session
          ? `Purchase this photo for ${numberToPrice(photo.price, 'USD')}`
          : 'Sign in to view photo'}
      </Button>
    </Stack>
  )
}

export default Paywall
