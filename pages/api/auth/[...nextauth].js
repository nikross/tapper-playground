import NextAuth from 'next-auth'

const options = {
  // debug: true,
  // Configure one or more authentication providers
  providers: [
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
      // requestTokenUrl: 'https://accounts.google.com/o/oauth2/auth',
      authorizationUrl: 'https://auth.laterpay.net/oauth2/auth?response_type=code',
      // profileUrl and profile are optional, according to the official docs (https://next-auth.js.org/configuration/providers#oauth-provider-options)
      // But not specifying them leads to an error that breaks node.js
      // See https://github.com/nextauthjs/next-auth/issues/209 and https://github.com/nextauthjs/next-auth/issues/1065
      profileUrl: 'http://localhost:3000/api/stubs/hydra/profile',
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        }
      },
      clientId: process.env.LP_NEXTAUTH_CLIENT_ID,
      // Don't specify client secret. Hydra is set up to only support 'client_secret_basic'.
      // But next-auth is using 'client_secret_post' by default.
      // See https://github.com/nextauthjs/next-auth/issues/950
      // clientSecret: process.env.LP_NEXTAUTH_CLIENT_SECRET,
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + Buffer.from((process.env.LP_NEXTAUTH_CLIENT_ID + ':' + process.env.LP_NEXTAUTH_CLIENT_SECRET)).toString('base64')
      }
    }
  ]
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
}

export default (req, res) => NextAuth(req, res, options)
