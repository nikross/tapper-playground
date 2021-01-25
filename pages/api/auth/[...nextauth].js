import NextAuth from 'next-auth'
import fromUnixTime from 'date-fns/fromUnixTime'
import isPast from 'date-fns/isPast'
import { decodeJWT } from '@/utils/decode-jwt'

// See https://next-auth.js.org/configuration/options
const options = {
  // debug: true,
  providers: [
    // Configure custom OAuth2 provider
    {
      id: 'laterpay',
      name: 'Laterpay',
      type: 'oauth',
      version: '2.0',
      scope: 'read write',
      params: {
        grant_type: 'authorization_code'
      },
      accessTokenUrl: 'https://auth.laterpay.net/oauth2/token',
      authorizationUrl: 'https://auth.laterpay.net/oauth2/auth?response_type=code',
      // According to the docs, profileUrl and profile are optional (https://next-auth.js.org/configuration/providers#oauth-provider-options)
      // But not specifying them results in an error.
      // See https://github.com/nextauthjs/next-auth/issues/209 and https://github.com/nextauthjs/next-auth/issues/1065
      profileUrl: `${process.env.NEXTAUTH_URL}/api/auth/profile`,
      profile: (p) => ({ id: p.userId }),
      clientId: process.env.LATERPAY_CLIENT_ID,
      // Don't specify a clientSecret. Add it via the Authorization header instead.
      // Reason: Hydra expects 'client_secret_basic'. But next-auth will use 'client_secret_post' when clientSecret is set in config.
      // See https://github.com/nextauthjs/next-auth/issues/950
      // clientSecret: '***',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + Buffer.from((process.env.LATERPAY_CLIENT_ID + ':' + process.env.LATERPAY_CLIENT_SECRET)).toString('base64')
      }
    }
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    jwt: true,
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 60 * 60 // 1 hour
    // Laterpay's access tokens are valid for 60 minutes and next-auth doesn't support refresh_token flow, so keep sessions short.
  },
  callbacks: {
    // Add properties to the JWT session for later use
    // See https://github.com/nextauthjs/next-auth/issues/1177#issuecomment-764961383
    jwt: async (token, user, account, profile, isNewUser) => {
      if (account?.accessToken) { // account will only be available on signin
        const { accessToken } = account
        // Add access token and user ID to the JWT session
        token.accessToken = accessToken
      }
      return Promise.resolve(token)
    },
    // The session callback decides what should be visible to the user when reaching for useSession, getSession or /api/auth/session
    // Add properties to session object to make them accessible from the browser
    session: async (session, token) => { // token equals the return value from jwt callback
      if (token?.accessToken) {
        // Check if Laterpay access token has expired
        const decodedLaterpayAccessToken = decodeJWT(token.accessToken)
        const expiryDate = fromUnixTime(decodedLaterpayAccessToken.exp)
        const laterpayAccessHasExpired = isPast(expiryDate)
        if (laterpayAccessHasExpired) {
          return false // Force signout
        }
        // Otherwise, add Laterpay access token to next-auth's JWT session
        session.accessToken = token.accessToken
        session.user.id = token.sub
        // token.sub equals the Laterpay user ID. It is derived from the decoded access token (see /api/auth/profile).
        return Promise.resolve(session)
      }
    }
  }
}

export default (req, res) => NextAuth(req, res, options)
