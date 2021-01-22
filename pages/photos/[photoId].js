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
import useSWR, { mutate } from 'swr'
import { formatDistanceToNowStrict } from 'date-fns'
import toast from 'react-hot-toast'

import AppShell from '@/components/AppShell'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'
import { getOfferingIdFromPhotoId } from '@/utils/offering'
import { numberToPrice } from '@/utils/price'

const Photo = ({ photo }) => {
  const [session, sessionIsLoading] = useSession()
  const [access, setAccess] = useState({})
  const [isPurchasing, setIsPurchasing] = useState(null)
  const offeringId = getOfferingIdFromPhotoId(photo.id)

  const { data } = useSWR(
    session && photo.id
      ? ['/v1/access', offeringId]
      : null,
    (url, offeringId) => fetchFromLaterpay(url, { params: { offering_id: offeringId } })
    // see https://swr.vercel.app/docs/arguments#passing-objects
  )

  useEffect(() => {
    // Set state
    if (data && data.access) {
      setAccess(data.access)
    }
  }, [data])

  const onPurchase = async () => {
    setIsPurchasing(true)
    const result = await fetchFromLaterpay('/v1/purchase', {
      method: 'post',
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
        sales_model: 'single_purchase'
      }
    })
    if (result.tab) {
      const { limit, status, total } = result.tab
      const success = status === 'open'
      success
        ? toast.success(`${numberToPrice(limit - total, '$')} remaining on your Tab`)
        : toast.error('Please settle your Tab')
    }
    // Revalidate access data
    mutate('/v1/access')
    setIsPurchasing(false)
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
          {access.has_access && (
            access.valid_to
              ? (
                <Alert
                  borderRadius='md'
                  color='blue.800'
                  fontWeight='500'
                  status='info'
                >
                  <AlertIcon />
                  Your access to this photo will expire in {formatDistanceToNowStrict(new Date(access.valid_to))}.
                </Alert>)
              : (
                <Alert
                  borderRadius='md'
                  color='green.800'
                  fontWeight='500'
                  status='success'
                >
                  <AlertIcon />
                  You have purchased this photo.
                </Alert>))}
          <Box position='relative'>
            <Box
              borderRadius='lg'
              boxShadow='0 2px 6px rgba(0,0,0,0.2)'
              overflow='hidden'
              style={{
                filter: access.has_access ? 'none' : 'blur(.5rem)',
                opacity: access.has_access ? '1' : '.25'
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
            {!access.has_access && (
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
                      isLoading={isPurchasing}
                      onClick={() => session ? onPurchase() : signIn()}
                    >
                      {session
                        ? `Purchase this photo for ${numberToPrice(photo.price, '$')}`
                        : 'Sign in to view photo'}
                    </Button>
                  </>)}
              </Stack>)}
          </Box>
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
