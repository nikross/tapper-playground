import { signedRequest } from '@/utils/signed-request'
import { Button, Flex, Text } from '@chakra-ui/react'
import {
  useSession, signIn, signOut
} from 'next-auth/client'
import { useEffect } from 'react'

const NextAuth = () => {
  const [session] = useSession()

  useEffect(() => {
    console.log({ session })
  }, [session])

  const makePurchase = async () => {
    const result = await signedRequest({
      endpoint: '/v1/purchase',
      method: 'post',
      accessToken: session.accessToken,
      data: {
        offering_id: 'test_product_1',
        summary: 'Product 1',
        price: {
          amount: 100,
          currency: 'USD'
        },
        payment_model: 'pay_merchant_later',
        sales_model: 'single_purchase'
      }
    })
    console.log(result)
  }

  const listTabs = async () => {
    const result = await signedRequest({
      endpoint: '/v1/tabs',
      accessToken: session.accessToken
    })
    console.log(result)
  }

  return (
    <Flex
      align='center'
      justify='center'
      direction='column'
      h='100vh'
    >
      <Text mb={4} fontSize='lg' fontWeight='600'>
        {session
          ? `Signed in as ${session.user.laterpayUserId}`
          : 'Not signed in'}
      </Text>
      <Button
        size='lg'
        colorScheme='blue'
        onClick={() => session ? signOut() : signIn('laterpay')}
      >
        {session ? 'Sign out' : 'Sign in'}
      </Button>
      {session && (
        <Button
          mt={6}
          size='lg'
          colorScheme='blue'
          onClick={() => makePurchase()}
        >
          Purchase
        </Button>)}
      {session && (
        <Button
          mt={6}
          size='lg'
          colorScheme='blue'
          onClick={() => listTabs()}
        >
          List tabs
        </Button>)}
    </Flex>
  )
}

export default NextAuth
