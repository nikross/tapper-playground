// import '../styles/globals.css'
import { Global, css } from '@emotion/core'
import { ThemeProvider, CSSReset, theme } from '@chakra-ui/core'

const GlobalStyle = ({ children }) => (
  <>
    <CSSReset />
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
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
