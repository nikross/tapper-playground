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
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 60 // 30 minutes
    // Laterpay's access tokens are valid for 60 minutes and next-auth doesn't support refresh_token flow, so keep sessions short.
  },
  callbacks: {
    // Add properties to JWT before generation
    jwt: async (token, user, account, profile, isNewUser) => {
      if (account) {
        const { accessToken } = account
        const tokenPayload = accessToken.split('.')[1]
        const buff = Buffer.from(tokenPayload, 'base64')
        const text = buff.toString('ascii')
        const tokenData = JSON.parse(text)
        token.accessToken = accessToken
        token.laterpayUserId = tokenData.sub
      }
      return Promise.resolve(token)
    },
    // Add property to session object
    session: async (session, user) => {
      // The user param equals JWT that has passed through the callback above (meaning it contains 'laterpayUserId')
      session.accessToken = user.accessToken // Add property to session
      session.user.laterpayUserId = user.laterpayUserId
      return Promise.resolve(session)
    }
  }
}

export default (req, res) => NextAuth(req, res, options)
