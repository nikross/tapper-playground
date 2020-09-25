import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Flex,
  SimpleGrid,
  Text
} from '@chakra-ui/core'

const MyTab = ({ tabData, userId }) => {
  const [amountSpent, setAmountSpent] = useState(0)
  const tabLimit = (tabData && tabData.limit) || 500
  useEffect(() => {
    let sumOfPurchases = 0
    if (tabData && tabData.purchases) {
      sumOfPurchases = tabData.purchases.reduce((sum, purchase) => (sum + purchase.cost), 0)
    }
    setAmountSpent(sumOfPurchases)
  }, [tabData])

  if (!userId) {
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
          <AlertIcon size='40px' mr={0} />
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

  return (
    <Box
      backgroundColor='white'
      borderRadius='lg'
      width='700px'
      maxWidth='full'
      p={userId ? 12 : 4}
    >
      <>
        <Flex
          justifyContent='center'
          flexDirection='column'
          alignItems='center'
          mb={12}
        >
          <CircularProgress
            capIsRound
            isIndeterminate={!tabData} // display loading state when there's no data yet
            size='150px'
            color='teal'
            thickness={0.1}
            value={amountSpent < tabLimit ? (amountSpent / tabLimit) * 100 : 100}
            transform='rotate(180deg)'
          />
          <Text mt={6} fontSize='xl' fontWeight='700'>
            {`You've spent €${(amountSpent / 100).toFixed(2)}`}
          </Text>
          <Text color='gray.500' fontSize='sm' fontWeight='600'>
            {amountSpent < tabLimit ? `€${((tabLimit - amountSpent) / 100).toFixed(2)} left` : 'Pay Now'}
          </Text>
        </Flex>
        {amountSpent < tabLimit ? (
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={6}
            w='500px'
            maxW='full'
            mx='auto'
          >
            {[1, 2, 5].map(price => (
              <Button
                key={price}
                display='inline-block'
                minW='150px'
                onClick={() => setAmountSpent(amountSpent + price * 100)}
              >
                {`Contribute €${price}`}
              </Button>
            ))}
          </SimpleGrid>
        ) : (
          <Flex justify='center'>
            <Button variantColor='teal' onClick={() => setAmountSpent(0)}>
              Settle Your Tab
            </Button>
          </Flex>
        )}
      </>
    </Box>
  )
}

MyTab.propTypes = {
  tabData: PropTypes.object,
  userId: PropTypes.string
}

export default MyTab
