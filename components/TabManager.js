import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  CircularProgress,
  Flex,
  Skeleton,
  Text
} from '@chakra-ui/react'

import ContributeButtons from '@/components/ContributeButtons'
import SettleTabButton from '@/components/SettleTabButton'
import { numberToPrice } from '@/utils/price'

const TabManager = ({ isValidating, tabData }) => {
  const [amountSpent, setAmountSpent] = useState(0)
  const tabLimit = (tabData && tabData.limit) || 500

  useEffect(() => {
    if (tabData) {
      setAmountSpent(tabData.total || 0)
    }
  }, [tabData])

  return (
    <Box
      bg='white'
      borderRadius='lg'
      boxShadow='0 2px 4px rgba(0,0,0,0.1)'
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
          isIndeterminate={!tabData || isValidating} // display loading state when there's no data yet
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
              ? <ContributeButtons
                  incrementTabTotal={contributionAmount => setAmountSpent(amountSpent + contributionAmount)}
                />
              : <SettleTabButton
                  tabId={tabData?.id}
                  totalAmount={tabData?.total}
                />}
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
