import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Flex, Heading, Link, Stack } from '@chakra-ui/react'
import { useSession, signIn, signOut } from 'next-auth/client'

const Header = () => {
  const router = useRouter()
  const [session] = useSession()
  return (
    <Flex
      backgroundColor='white'
      h='70px'
      px={6}
      boxShadow='0 0 4px rgba(0,0,0,0.2)'
      position='fixed'
      top='0'
      left='0'
      right='0'
      align='center'
      justify='space-between'
      zIndex='3'
    >
      <Stack isInline alignItems='center' spacing={4}>
        <NextLink href='/'>
          <a>
            <Heading
              as='h1'
              display={{ base: 'none', lg: 'block' }}
              fontSize='1.25rem'
              mr={8}
              transition='color .3s ease'
              _hover={{
                color: 'gray.600'
              }}
            >
              Tapper Playground
            </Heading>
          </a>
        </NextLink>
        <NavItem
          href='/'
          isActive={router.pathname.includes('/photos')}
          label='Photos'
        />
        <NavItem
          href='/tab'
          label='My Tab'
        />
      </Stack>
      <Stack isInline alignItems='center' spacing={6}>
        {session &&
          <Box
            display={{ base: 'none', md: 'block' }}
            color='gray.500'
            fontSize='sm'
          >
            <Box>Signed in as</Box>
            <Box
              isTruncated
              fontWeight='700'
              maxW='10rem'
              title={session.user.id}
            >
              {session.user.id}
            </Box>
          </Box>}
        <Button
          fontSize='1.125rem'
          variant='ghost'
          onClick={() => session ? signOut() : signIn('laterpay')}
        >
          {session ? 'Sign out' : 'Sign in'}
        </Button>
      </Stack>
    </Flex>
  )
}

const NavItem = ({ label, href, ...props }) => {
  const router = useRouter()
  const isActive = props.isActive || href === router.pathname
  return (
    <NextLink href={href} passHref>
      <Link
        display='inline-block'
        fontSize='1.125rem'
        variant='link'
        textDecoration='none'
        px={2}
        py={4}
        position='relative'
        _after={{
          content: isActive ? '""' : undefined,
          display: 'block',
          position: 'absolute',
          bottom: '-5px',
          left: 0,
          h: '4px',
          w: 'full',
          bg: 'teal.400'
        }}
        _hover={{
          color: 'gray.600',
          textDecoration: 'none'
        }}
      >
        {label}
      </Link>
    </NextLink>
  )
}

export default Header
