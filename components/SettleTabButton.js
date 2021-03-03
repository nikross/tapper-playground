import { Button, Flex, useDisclosure } from '@chakra-ui/react'

import CheckoutModal from '@/components/CheckoutModal'

const SettleTabButton = ({ tabId, totalAmount }) => {
  const { isOpen: isCheckoutModalOpen, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure()

  const onButtonClick = async () => {
    onOpenModal()
  }

  return (
    <Flex justify='center'>
      <Button
        colorScheme='teal'
        size='lg'
        onClick={() => onButtonClick()}
      >
        Settle Your Tab
      </Button>
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={onCloseModal}
        tabId={tabId}
        totalAmount={totalAmount}
      />
    </Flex>
  )
}

export default SettleTabButton
