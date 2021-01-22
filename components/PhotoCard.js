import Image from 'next/image'
import NextLink from 'next/link'
import { Box, Heading, Text } from '@chakra-ui/react'

const PhotoCard = ({ id, title, image }) => {
  const price = '2.00'
  return (
    <NextLink href={`/photos/${id}`}>
      <a>
        <Box
          bg='white'
          borderRadius='lg'
          boxShadow='0 2px 4px rgba(0,0,0,0.1)'
          w='20rem'
          overflow='hidden'
          transition='box-shadow .1s ease-in-out'
          _hover={{
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)'
          }}
        >
          <Box
            p={2}
            bg='white'
          >
            <Box
              h='12rem'
              w='full'
              mx='auto'
              borderRadius='md'
              overflow='hidden'
            >
              <Image
                src={`https://picsum.photos/id/${id}/600/400`}
                alt={title}
                width={600}
                height={400}
              />
            </Box>
          </Box>
          <Box
            px={3}
            pt={1}
            pb={2}
          >
            <Heading
              isTruncated
              as='h3'
              fontSize='1.125rem'
              fontWeight='600'
            >
              {title}
            </Heading>
            <Text
              color='teal.600'
              fontWeight='700'
            >
              {`$${price}`}
            </Text>
          </Box>
        </Box>
      </a>
    </NextLink>
  )
}

export default PhotoCard
