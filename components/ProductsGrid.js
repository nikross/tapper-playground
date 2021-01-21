import { Box, Flex, Grid } from '@chakra-ui/react'
import ProductCard from '@/components/ProductCard'

const ProductsGrid = ({ products }) => {
  return (
    <Flex
      px={8}
      py={6}
      justify='center'
    >
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={6}
      >
        {products.map(({ id, price, title, image }) => (
          <Box key={id}>
            <ProductCard
              id={id}
              title={title}
              image={image}
              price={price}
            />
          </Box>
        ))}
      </Grid>
    </Flex>
  )
}

export default ProductsGrid
