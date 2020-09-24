import PropTypes from 'prop-types'
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/core'

const Header = ({ userId, onButtonClick }) => {
  return (
    <Flex
      backgroundColor='white'
      borderRadius='md'
      px={6}
      py={4}
      boxShadow='0 0 4px rgba(0,0,0,0.2)'
      position='fixed'
      top='0'
      left='0'
      right='0'
      justify='space-between'
      zIndex='3'
    >
      <Heading as='h1' fontSize='1.25rem'>Tapper Playground</Heading>
      <Stack isInline justifyContent='flex-end' spacing={6}>
        {userId &&
          <Box>
            <Text as='span' mr={2}>User ID:</Text>
            <Text as='span' fontWeight='700'>{userId}</Text>
          </Box>}
        <Button
          variant='link'
          onClick={() => onButtonClick()}
        >
          {userId ? 'Sign Out' : 'Sign In'}
        </Button>
      </Stack>
    </Flex>
  )
}

Header.propTypes = {
  userId: PropTypes.string,
  onButtonClick: PropTypes.func.isRequired
}

export default Header
