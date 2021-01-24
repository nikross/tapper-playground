import { Spinner } from '@chakra-ui/react'

const LoadingSpinner = () => {
  return (
    <Spinner
      thickness='3px'
      speed='0.5s'
      emptyColor='gray.300'
      color='teal.400'
      size='xl'
      position='absolute'
      top='calc(50% - 1.5rem)'
      left='calc(50% - 1.5rem)'
    />
  )
}

export default LoadingSpinner
