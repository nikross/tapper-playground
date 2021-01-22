import NextAuth from 'next-auth'

// See https://next-auth.js.org/configuration/options
const options = {
  debug: true,
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
      // According to the official docs, profileUrl and profile are optional (https://next-auth.js.org/configuration/providers#oauth-provider-options)
      // But not specifying them results in an error.
      // See https://github.com/nextauthjs/next-auth/issues/209 and https://github.com/nextauthjs/next-auth/issues/1065
      profileUrl: `${process.env.NEXTAUTH_URL}/api/stubs/profile`,
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        }
      },
      clientId: process.env.LP_CLIENT_ID,
      // Don't specify clientSecret. Add it via Authoirzation header instead.
      // Reason: Hydra requires 'client_secret_basic'. But next-auth will use 'client_secret_post' when clientSecret is set in config.
      // See https://github.com/nextauthjs/next-auth/issues/950
      // clientSecret: '***',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + Buffer.from((process.env.LP_CLIENT_ID + ':' + process.env.LP_CLIENT_SECRET)).toString('base64')
      }
    }
  ]/* ,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    jwt: true,
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 60 * 60 // 60 minutes
    // Laterpay's access tokens are valid for 60 minutes and next-auth doesn't support refresh_token flow, so keep sessions short.
  },
  callbacks: {
    // Add properties to the JWT session for later use
    // See https://github.com/nextauthjs/next-auth/issues/1177#issuecomment-764961383
    jwt: async (token, user, account, profile, isNewUser) => {
      if (account?.accessToken) { // account will only be available on signin
        // Decode token to get Laterpay user ID
        const { accessToken } = account
        const tokenPayload = accessToken.split('.')[1]
        const buff = Buffer.from(tokenPayload, 'base64')
        const text = buff.toString('ascii')
        const tokenData = JSON.parse(text)
        // Add access token and user ID to the JWT session
        token.accessToken = accessToken
        token.laterpayUserId = tokenData.sub
      }
      return Promise.resolve(token)
    },
    // The session callback decides what should be visible to the user when reaching for useSession, getSession or /api/auth/session
    // Add properties to session object to make them accessible from the browser
    session: async (session, token) => { // token equals the return value from jwt callback
      if (token?.accessToken) {
        session.accessToken = token.accessToken
        session.user.id = token.laterpayUserId
        return Promise.resolve(session)
      }
    }
  } */
}

export default (req, res) => NextAuth(req, res, options)
