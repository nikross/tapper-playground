import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Stack
} from '@chakra-ui/react'
import { ArrowBackIcon, LockIcon } from '@chakra-ui/icons'
import { useSession, signIn } from 'next-auth/client'
import useSWR from 'swr'
import { formatDistanceToNowStrict } from 'date-fns'

import AppShell from '@/components/AppShell'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'
import { humanReadablePrice } from '@/utils/price'

const Product = ({ product }) => {
  const [session] = useSession()
  const [userHasAccess, setUserHasAccess] = useState()
  const expirationDate = new Date().setMinutes(59)

  const { data } = useSWR(
    session && product.id
      ? ['/v1/access', session.accessToken, product.id]
      : null,
    (url, accessToken, offeringId) => fetchFromLaterpay(url, { accessToken, params: { offering_id: offeringId } })
    // see https://swr.vercel.app/docs/arguments#passing-objects
  )

  useEffect(() => {
    console.log({ data })
    if (data && data.access && !userHasAccess) {
      setUserHasAccess(data.access.has_access)
    }
  }, [data])

  const onPurchase = async () => {
    const result = await fetchFromLaterpay('/v1/purchase', {
      method: 'post',
      accessToken: session.accessToken,
      data: {
        offering_id: product.id,
        summary: product.title,
        price: {
          amount: product.price,
          currency: 'USD'
        },
        payment_model: 'pay_merchant_later',
        sales_model: 'time_pass',
        valid_timedelta: '1d'
      }
    })
    console.log(result)
  }

  return (
    <AppShell>
      <Flex
        px={8}
        pt={8}
        pb={12}
        justify='center'
      >
        <Stack
          maxW='50rem'
          spacing={8}
        >
          <Box>
            <NextLink href='/' passHref>
              <Button
                as='a'
                variant='link'
              >
                <ArrowBackIcon mr={1} />
                View all kittens
              </Button>
            </NextLink>
          </Box>
          <Divider borderColor='gray.300' mt='1rem !important' />
          <Heading>
            {product.title}
          </Heading>
          {userHasAccess && (
            <Alert
              borderRadius='md'
              color='blue.800'
              fontWeight='500'
              status='info'
            >
              <AlertIcon />
              Your access to this picture will expire in {formatDistanceToNowStrict(expirationDate)}.
            </Alert>)}
          <Box position='relative'>
            <Image
              src={product.image}
              alt={product.id}
              fit='cover'
              minW='800px'
              maxH='1000px'
              borderRadius='lg'
              boxShadow='0 2px 6px rgba(0,0,0,0.2)'
              overflow='hidden'
              opacity={userHasAccess ? '1' : '.25'}
              style={{
                filter: userHasAccess ? 'none' : 'blur(.5rem)'
              }}
            />
            {!userHasAccess && (
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
                  onClick={() => session ? onPurchase() : signIn('laterpay')}
                >
                  {session
                    ? `Purchase this picture for $${humanReadablePrice(product.price)}`
                    : 'Sign in to view picture'}
                </Button>
              </Stack>)}
          </Box>
          <Divider borderColor='gray.300' />
          <NextLink href='/' passHref>
            <Button
              color='gray.500'
              leftIcon={<ArrowBackIcon />}
              size='lg'
              variant='ghost'
              _hover={{
                color: 'gray.700'
              }}
            >
              Back to all kittens
            </Button>
          </NextLink>
        </Stack>
      </Flex>
    </AppShell>
  )
}

export async function getStaticProps ({ params }) {
  const { productId } = params
  const kittens = (await import('@/data/kittens.json')).data
  const kitten = kittens.find(({ id }) => id === productId)
  const product = {
    id: kitten.id,
    image: kitten.url,
    title: kitten.name,
    price: kitten.price
  }

  return {
    props: {
      product
    }
  }
}

export async function getStaticPaths () {
  const kittens = (await import('@/data/kittens.json')).data
  const paths = kittens.map(({ id }) => {
    return { params: { productId: id } }
  })
  return {
    paths,
    fallback: false
  }
}

export default Product
