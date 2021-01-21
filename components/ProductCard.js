import NextLink from 'next/link'
import { Box, Heading, Image, Text } from '@chakra-ui/react'

const ProductCard = ({ id, title, image }) => {
  const price = '2.00'
  return (
    <NextLink href={`/products/${id}`}>
      <a>
        <Box
          bg='white'
          borderRadius='lg'
          boxShadow='0 2px 4px rgba(0,0,0,0.1)'
          w='15rem'
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
            <Image
              src={image}
              alt={id}
              fit='cover'
              h='15rem'
              w='full'
              mx='auto'
              borderRadius='md'
              overflow='hidden'
            />
          </Box>
          <Box
            px={2}
            pt={4}
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

export default ProductCard
