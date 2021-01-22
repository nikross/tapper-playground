import { useEffect, useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack
} from '@chakra-ui/react'
import { ArrowBackIcon, LockIcon } from '@chakra-ui/icons'
import { useSession, signIn } from 'next-auth/client'
import useSWR from 'swr'
import { formatDistanceToNowStrict } from 'date-fns'

import AppShell from '@/components/AppShell'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'
import { humanReadablePrice } from '@/utils/price'

const Photo = ({ photo }) => {
  const [session, sessionIsLoading] = useSession()
  const [userHasAccess, setUserHasAccess] = useState(null)
  const expirationDate = new Date().setMinutes(59)
  const offeringId = `playground-photo-${photo.id}`

  const { data } = useSWR(
    session && photo.id
      ? ['/v1/access', session.accessToken, offeringId]
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
        offering_id: offeringId,
        metadata: {
          tapper_playground: true
        },
        summary: photo.title,
        price: {
          amount: photo.price,
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
                View all photos
              </Button>
            </NextLink>
          </Box>
          <Divider borderColor='gray.300' mt='1rem !important' />
          <Heading>
            {photo.title}
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
            <Box
              borderRadius='lg'
              boxShadow='0 2px 6px rgba(0,0,0,0.2)'
              overflow='hidden'
              style={{
                filter: userHasAccess ? 'none' : 'blur(.5rem)',
                opacity: userHasAccess ? '1' : '.25'
              }}
            >
              <Box mb={-2}>
                <Image
                  src={`https://picsum.photos/id/${photo.id}/1280/960`}
                  alt={photo.title}
                  width={1280}
                  height={960}
                />
              </Box>
            </Box>
            {!userHasAccess && (
              <Stack
                alignItems='center'
                spacing={6}
                w='full'
                position='absolute'
                top='calc(50% - 5rem)'
              >
                {!sessionIsLoading && (
                  <>
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
                        ? `Purchase this picture for $${humanReadablePrice(photo.price)}`
                        : 'Sign in to view picture'}
                    </Button>
                  </>)}
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
              Back to all photos
            </Button>
          </NextLink>
        </Stack>
      </Flex>
    </AppShell>
  )
}

export async function getStaticProps ({ params }) {
  const { photoId } = params
  const photos = (await import('@/data/photos.json')).data
  const photo = photos.find(({ id }) => id === parseInt(photoId))
  return {
    props: {
      photo
    }
  }
}

export async function getStaticPaths () {
  const photos = (await import('@/data/photos.json')).data
  const paths = photos.map(({ id }) => {
    return { params: { photoId: id.toString() } }
  })
  return {
    paths,
    fallback: false
  }
}

export default Photo
