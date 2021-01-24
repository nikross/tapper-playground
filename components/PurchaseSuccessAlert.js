import { Alert, AlertIcon } from '@chakra-ui/react'
import { formatDistanceToNowStrict } from 'date-fns'

const PurchaseSuccessAlert = ({ accessExpiryDate }) => {
  if (accessExpiryDate) {
    return (
      <Alert
        borderRadius='md'
        color='blue.800'
        fontWeight='500'
        status='info'
      >
        <AlertIcon />
        Your time pass will expire in {formatDistanceToNowStrict(new Date(accessExpiryDate))}.
      </Alert>
    )
  }

  return (
    <Alert
      borderRadius='md'
      color='green.800'
      fontWeight='500'
      status='success'
    >
      <AlertIcon />
      You have purchased this photo.
    </Alert>
  )
}

export default PurchaseSuccessAlert
