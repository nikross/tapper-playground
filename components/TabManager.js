import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { mutate } from 'swr'
import { useSession } from 'next-auth/client'
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Flex,
  Skeleton,
  Text
} from '@chakra-ui/react'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'
import { numberToPrice } from '@/utils/price'

const TabManager = ({ tabData }) => {
  const [session] = useSession()
  const [amountSpent, setAmountSpent] = useState(0)
  const [isSettlingTab, setIsSettlingTab] = useState(false)
  const tabLimit = (tabData && tabData.limit) || 500

  useEffect(() => {
    let sumOfPurchases = 0
    if (tabData && tabData.purchases) {
      sumOfPurchases = tabData.purchases.reduce((sum, purchase) => (sum + purchase.price.amount), 0)
    }
    setAmountSpent(sumOfPurchases)
  }, [tabData])

  const onContribute = async amount => {
    setAmountSpent(amountSpent + amount)
    const result = await fetchFromLaterpay('/v1/purchase', {
      method: 'post',
      accessToken: session.accessToken,
      data: {
        offering_id: 'playground-contribution',
        metadata: {
          tapper_playground: true
        },
        summary: 'Contribution',
        price: {
          amount,
          currency: 'USD'
        },
        payment_model: 'pay_merchant_later',
        sales_model: 'contribution'
      }
    })
    console.log(result)
    // Revalidate Tab data
    mutate(['/v1/tabs'])
  }

  const onSettleTab = async tabId => {
    setIsSettlingTab(true)
    if (tabId) {
      const result = await fetchFromLaterpay(`/v1/payment/finish/${tabId}`, {
        method: 'post',
        accessToken: session.accessToken
      })
      console.log(result)
      // Revalidate Tab data
      mutate(['/v1/tabs'])
    }
    setIsSettlingTab(false)
  }

  return (
    <Box
      backgroundColor='white'
      borderRadius='lg'
      width='700px'
      maxWidth='full'
      p={12}
    >
      <Flex
        justifyContent='center'
        flexDirection='column'
        alignItems='center'
      >
        <CircularProgress
          capIsRound
          isIndeterminate={!tabData} // display loading state when there's no data yet
          size='150px'
          color='teal.400'
          thickness={5}
          trackColor='gray.100'
          value={amountSpent < tabLimit ? (amountSpent / tabLimit) * 100 : 100}
          transform='rotate(180deg)'
        />
        <Text
          fontSize='xl'
          fontWeight='700'
          pt={6}
          pb={2}
        >
          {`You've spent ${numberToPrice(amountSpent, '$')}`}
        </Text>
        <Text
          color='gray.400'
          fontSize='sm'
          fontWeight='700'
          letterSpacing='.5px'
          textTransform='uppercase'
        >
          {amountSpent < tabLimit ? `${numberToPrice(tabLimit - amountSpent, '$')} remaining` : 'Pay Now'}
        </Text>
        <Skeleton
          isLoaded={tabData}
          startColor='white'
          endColor='white'
        >
          <Box pt={8}>
            {amountSpent < tabLimit
              ? (
                <ButtonGroup spacing={4}>
                  {[1, 2, 5].map(price => (
                    <Button
                      key={price}
                      colorScheme='teal'
                      variant='outline'
                      size='lg'
                      onClick={() => onContribute(price * 100)}
                    >
                      {`Contribute $${price}`}
                    </Button>
                  ))}
                </ButtonGroup>)
              : (
                <Flex justify='center'>
                  <Button
                    isLoading={isSettlingTab}
                    colorScheme='teal'
                    size='lg'
                    onClick={() => onSettleTab(tabData && tabData.id)}
                  >
                    Settle Your Tab
                  </Button>
                </Flex>)}
          </Box>
        </Skeleton>
      </Flex>
    </Box>
  )
}

TabManager.propTypes = {
  tabData: PropTypes.object
}

export default TabManager
