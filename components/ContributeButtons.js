import { mutate } from 'swr'
import {
  Button,
  ButtonGroup,
  useBreakpointValue
} from '@chakra-ui/react'
import toast from 'react-hot-toast'
import { fetchFromLaterpay } from '@/utils/laterpay-fetcher'
import { numberToPrice } from '@/utils/price'

const ContributeButtons = ({ incrementAmountSpent }) => {
  const buttonGroupDirection = useBreakpointValue({ base: 'column', md: 'row' })
  const contributionOptions = [100, 200, 500]

  const onContribute = async amount => {
    incrementAmountSpent(amount)
    const result = await fetchFromLaterpay('/v1/purchase', {
      method: 'post',
      data: {
        offering_id: 'playground-contribution',
        summary: 'Contribution',
        price: {
          amount,
          currency: 'USD'
        },
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

  return (
    <ButtonGroup
      flexDirection={buttonGroupDirection}
      spacing={{ base: 0, md: 4 }}
    >
      {contributionOptions.map(price => (
        <Button
          key={price}
          colorScheme='teal'
          variant='outline'
          size='lg'
          mb={{ base: 4, md: 0 }}
          onClick={() => onContribute(price)}
        >
          {`Contribute ${numberToPrice(price, 'USD')}`}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export default ContributeButtons
