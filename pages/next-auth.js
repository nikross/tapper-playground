import { Button, Flex, Text } from '@chakra-ui/react'
import {
  useSession, signIn, signOut
} from 'next-auth/client'

const NextAuth = () => {
  const [session] = useSession()
  console.log({ session })
  return (
    <Flex
      align='center'
      justify='center'
      direction='column'
      h='100vh'
    >
      <Text mb={4} fontSize='lg' fontWeight='600'>
        {session
          ? `Signed in as ${session.user.email}`
          : 'Not signed in'}
      </Text>
      <Button
        size='lg'
        colorScheme='blue'
        onClick={() => session ? signOut() : signIn('laterpay')}
      >
        {session ? 'Sign out' : 'Sign in'}
      </Button>
    </Flex>
  )
}

export default NextAuth
