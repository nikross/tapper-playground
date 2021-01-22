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
      backgroundColor='white'
      borderRadius='lg'
      width='700px'
      maxWidth='full'
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
        <AlertDescription maxWidth='sm'>
          See top right corner.
        </AlertDescription>
      </Alert>
    </Box>
  )
}

export default SignInAlert
