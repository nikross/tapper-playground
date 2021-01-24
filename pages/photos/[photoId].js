import { useEffect, useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useSession } from 'next-auth/client'
import useSWR from 'swr'

import AppShell from '@/components/AppShell'
import LoadingSpinner from '@/components/LoadingSpinner'
import Paywall from '@/components/Paywall'
import PurchaseSuccessAlert from '@/components/PurchaseSuccessAlert'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'
import { getOfferingIdFromPhotoId } from '@/utils/offering'

const Photo = ({ photo }) => {
  const [session] = useSession()
  const [access, setAccess] = useState({})
  const offeringId = getOfferingIdFromPhotoId(photo.id)

  const { data, isValidating } = useSWR(
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
            <PurchaseSuccessAlert accessExpiryDate={access.valid_to} />)}
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
            {isValidating && !access.has_access && (
              // Show loading spinner while access check is running
              <LoadingSpinner />)}
            {(!session || (access.has_access === false && !isValidating)) && (
              // Show paywall when user isn't signed in or when the access check was negative
              <Paywall
                offeringId={offeringId}
                photo={photo}
              />)}
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
    props: { photo }
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
