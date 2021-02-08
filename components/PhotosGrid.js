import { Box, Flex, Grid } from '@chakra-ui/react'
import PhotoCard from '@/components/PhotoCard'

const PhotosGrid = ({ photos }) => {
  return (
    <Flex
      px={8}
      py={6}
      justify='center'
    >
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={6}
      >
        {photos.map(({ id, price, title }) => (
          <Box key={id}>
            <PhotoCard
              id={id}
              title={title}
              price={price}
            />
          </Box>
        ))}
      </Grid>
    </Flex>
  )
}

export default PhotosGrid
