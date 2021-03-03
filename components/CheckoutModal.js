import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '@/components/CheckoutForm'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

const CheckoutModal = ({ isOpen, onClose, tabId, totalAmount }) => {
  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent
        h='30rem'
        maxW='45rem'
        px={4}
      >
        <ModalHeader textAlign='center' pt={12}>
          Settle Your Tab
        </ModalHeader>
        <Elements stripe={stripePromise}>
          <CheckoutForm tabId={tabId} totalAmount={totalAmount} />
        </Elements>
      </ModalContent>
    </Modal>
  )
}

export default CheckoutModal
