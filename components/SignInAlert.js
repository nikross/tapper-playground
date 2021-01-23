import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box
} from '@chakra-ui/react'

const SignInAlert = () => {
  return (
    <Box
      bg='white'
      borderRadius='lg'
      w='700px'
      maxW='full'
      p={4}
    >
      <Alert
        status='info'
        variant='subtle'
        flexDirection='column'
        justifyContent='center'
        textAlign='center'
        height='200px'
        borderRadius='md'
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          Sign in to view your tab
        </AlertTitle>
        <AlertDescription maxW='sm'>
          See top right corner.
        </AlertDescription>
      </Alert>
    </Box>
  )
}

export default SignInAlert
