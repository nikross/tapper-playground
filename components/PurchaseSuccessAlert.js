import { Alert, AlertIcon } from '@chakra-ui/react'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'

const PurchaseSuccessAlert = ({ accessExpiryDate }) => {
  if (Date.parse(accessExpiryDate)) { // Validate date string
    return (
      <Alert
        borderColor='blue.200'
        borderWidth='1px'
        borderRadius='md'
        color='blue.700'
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
      borderColor='green.200'
      borderWidth='1px'
      borderRadius='md'
      color='green.700'
      fontWeight='500'
      status='success'
    >
      <AlertIcon />
      You have purchased this photo.
    </Alert>
  )
}

export default PurchaseSuccessAlert
