import { useState } from 'react'
import qs from 'qs'
import { Button, Flex } from '@chakra-ui/react'
import { loadStripe } from '@stripe/stripe-js'
import toast from 'react-hot-toast'

import { handleRequest } from '@/utils/laterpay-fetcher'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

const SettleTabButton = ({ tabId, totalAmount }) => {
  const [isSettlingTab, setIsSettlingTab] = useState(false)

  const onButtonClick = async () => {
    setIsSettlingTab(true)
    const stripe = await stripePromise
    const session = await handleRequest({
      url: '/api/stripe/checkout',
      method: 'post',
      data: qs.stringify({
        tabId,
        totalAmount
      })
    })
    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    })
    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
      toast.error(result.error.message)
    }
  }

  return (
    <Flex justify='center'>
      <Button
        isLoading={isSettlingTab}
        colorScheme='teal'
        size='lg'
        onClick={() => onButtonClick()}
      >
        Settle Your Tab
      </Button>
    </Flex>
  )
}

export default SettleTabButton
