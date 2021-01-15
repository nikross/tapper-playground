/* global fetch */
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { mutate } from 'swr'
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
  const [isSettlingTab, setIsSettlingTab] = useState(false)
  const tabLimit = (tabData && tabData.limit) || 500
  useEffect(() => {
    let sumOfPurchases = 0
    if (tabData && tabData.purchases) {
      sumOfPurchases = tabData.purchases.reduce((sum, purchase) => (sum + purchase.cost), 0)
    }
    setAmountSpent(sumOfPurchases)
  }, [tabData])

  const handlePurchase = async amount => {
    setAmountSpent(amountSpent + amount)
    const reqData = JSON.stringify({
      user_id: userId,
      cost: amount,
      payment_model: 'pay_merchant_later'
    })
    await fetch('/api/laterpay/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: reqData
    })
    // Revalidate data from internal API
    mutate([`/v1/tabs/list/${userId}`])
  }

  const handleSettleTab = async tabId => {
    setIsSettlingTab(true)
    if (tabId) {
      console.log('settling tab', tabId)
      await fetch(`/api/laterpay/settle?tabId=${tabId}`, { method: 'POST' })
      // Revalidate data from internal API
      mutate([`/v1/tabs/list/${userId}`])
      setIsSettlingTab(false)
    }
  }

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
        {amountSpent < tabLimit
          ? (
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
                  onClick={() => handlePurchase(price * 100)}
                >
                  {`Contribute €${price}`}
                </Button>
              ))}
            </SimpleGrid>)
          : (
            <Flex justify='center'>
              <Button
                isLoading={isSettlingTab}
                variantColor='teal'
                onClick={() => handleSettleTab(tabData && tabData.id)}
              >
                Settle Your Tab
              </Button>
            </Flex>)}
      </>
    </Box>
  )
}

MyTab.propTypes = {
  tabData: PropTypes.object,
  userId: PropTypes.string
}

export default MyTab
