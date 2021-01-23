import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Flex,
  Skeleton,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import toast from 'react-hot-toast'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'
import { numberToPrice } from '@/utils/price'

const TabManager = ({ tabData }) => {
  const router = useRouter()
  const [amountSpent, setAmountSpent] = useState(0)
  const [isSettlingTab, setIsSettlingTab] = useState(false)
  const tabLimit = (tabData && tabData.limit) || 500
  const buttonGroupDirection = useBreakpointValue({ base: 'column', sm: 'row' })
  const contributionOptions = [100, 200, 500]

  useEffect(() => {
    if (tabData) {
      setAmountSpent(tabData.total || 0)
    }
  }, [tabData])

  const onContribute = async amount => {
    setAmountSpent(amountSpent + amount)
    const result = await fetchFromLaterpay('/v1/purchase', {
      method: 'post',
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
    if (result.tab) {
      const { limit, status, total } = result.tab
      const success = status === 'open'
      if (success) {
        toast.success(`${numberToPrice(limit - total, 'USD')} remaining on your Tab`)
        // Revalidate Tab data
        mutate('/v1/tabs')
      } else {
        toast.error('Please settle your Tab')
      }
    }
  }

  const onSettleTab = async tabId => {
    setIsSettlingTab(true)
    if (tabId) {
      const result = await fetchFromLaterpay(`/v1/payment/finish/${tabId}`, {
        method: 'post'
      })
      if (result.error) {
        toast.error(result.error.message)
      } else {
        toast.success('Tab settled')

        // If user just bought a photo, redirect back to that photo page
        if (router.query.fromPhoto) {
          router.push(`/photos/${router.query.fromPhoto}`)
          return
        }
        // Otherwise, stay on the current page and reset state
        setAmountSpent(0)
        // Revalidate Tab data
        mutate('/v1/tabs')
      }
    }
    setIsSettlingTab(false)
  }

  return (
    <Box
      bg='white'
      borderRadius='lg'
      w='700px'
      maxW='full'
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
          {`You've spent ${numberToPrice(amountSpent, 'USD')}`}
        </Text>
        <Text
          color='gray.400'
          fontSize='sm'
          fontWeight='700'
          letterSpacing='.5px'
          textTransform='uppercase'
        >
          {amountSpent < tabLimit
            ? `${numberToPrice(tabLimit - amountSpent, 'USD')} remaining`
            : 'Pay Now'}
        </Text>
        <Skeleton
          isLoaded={tabData}
          startColor='white'
          endColor='white'
        >
          <Box pt={8}>
            {amountSpent < tabLimit
              ? (
                <ButtonGroup
                  flexDirection={buttonGroupDirection}
                  spacing={{ base: 0, sm: 4 }}
                >
                  {contributionOptions.map(price => (
                    <Button
                      key={price}
                      colorScheme='teal'
                      variant='outline'
                      size='lg'
                      mb={{ base: 4, sm: 0 }}
                      onClick={() => onContribute(price)}
                    >
                      {`Contribute ${numberToPrice(price, 'USD')}`}
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
