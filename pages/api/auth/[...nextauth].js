import NextAuth from 'next-auth'

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
      // According to the official docs, profileUrl and profile are optional (https://next-auth.js.org/configuration/providers#oauth-provider-options)
      // But not specifying them results in an error.
      // See https://github.com/nextauthjs/next-auth/issues/209 and https://github.com/nextauthjs/next-auth/issues/1065
      profileUrl: 'http://localhost:3000/api/stubs/hydra/profile',
      profile: (profile) => {
        return {
          id: profile.laterpayUserId,
          laterpayUserId: profile.laterpayUserId,
          name: null,
          email: null,
          image: null
        }
      },
      clientId: process.env.LP_NEXTAUTH_CLIENT_ID,
      // Don't specify clientSecret. Add it via Authoirzation header instead.
      // Reason: Hydra requires 'client_secret_basic'. But next-auth will use 'client_secret_post' when clientSecret is set in config.
      // See https://github.com/nextauthjs/next-auth/issues/950
      // clientSecret: process.env.LP_NEXTAUTH_CLIENT_SECRET,
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + Buffer.from((process.env.LP_NEXTAUTH_CLIENT_ID + ':' + process.env.LP_NEXTAUTH_CLIENT_SECRET)).toString('base64')
      }
    }
  ],
  secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
  jwt: {
    secret: process.env.LP_NEXTAUTH_CLIENT_SECRET
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
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
}

export default (req, res) => NextAuth(req, res, options)
