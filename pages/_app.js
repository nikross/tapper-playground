// import '@/styles/globals.css'
import { Global, css } from '@emotion/react'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { Provider as AuthProvider } from 'next-auth/client'

const GlobalStyle = ({ children }) => (
  <>
    <Global
      styles={css`
        html {
          min-width: 360px;
          scroll-behavior: smooth;
        }
        body {
          background-color: #EDF2F7;
        }
        #__next {
          min-height: 100vh;
        }
      `}
    />
    {children}
  </>
)

function MyApp ({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider session={pageProps.session}>
        <GlobalStyle />
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
