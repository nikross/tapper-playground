import { useEffect, useState } from 'react'
import { Button, Flex, Textarea } from '@chakra-ui/react'
import { laterpayPublicClient } from '@/lib/oauth'

const StrongIdentity = () => {
  const [token, setToken] = useState()

  const authorize = () => {
    if (laterpayPublicClient) {
      const uri = laterpayPublicClient.code.getUri({
        query: { // Use query instead of body due to 'Content-Type: application/x-www-form-urlencoded'
          code_challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM', // https://ldapwiki.com/wiki/Code_challenge_method
          code_challenge_method: 'S256'
        },
        state: 'staticState'
      })
      window.location.href = uri
    }
  }

  useEffect(() => {
    if (window.location.search.includes('code')) {
      laterpayPublicClient.code.getToken(window.location.href, {
        body: {
          code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' // https://ldapwiki.com/wiki/Code_challenge_method
        },
        state: 'staticState'
      })
        .then(response => {
          const { accessToken, data } = response
          console.log(data)
          setToken(accessToken)
        })
        .catch(error => console.log(error))
    }
  }, [])

  return (
    <Flex
      align='center'
      justify='center'
      direction='column'
      h='100vh'
    >
      <Button
        size='lg'
        colorScheme='blue'
        onClick={() => authorize()}
      >
        Authorize
      </Button>
      {token && (
        <Textarea
          readOnly
          value={token}
          bg='white'
          mt={6}
          maxW='lg'
          rows='20'
        />
      )}
    </Flex>
  )
}

export default StrongIdentity
