import { Box, Image } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box textAlign='center' p={6}>
      <a
        href='https://laterpay.net/'
        target='_blank'
        rel='noopener noreferrer'
      >
        <span>Powered by</span>
        <Image
          display='inline'
          src='/laterpay.svg'
          alt='Laterpay Logo'
          ml={2}
          h={5}
          w='90px'
        />
      </a>
    </Box>
  )
}

export default Footer
