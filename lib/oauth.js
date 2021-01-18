import ClientOAuth2 from 'client-oauth2'
// import { nanoid } from 'nanoid'

export const laterpayPublicClient = new ClientOAuth2({
  clientId: process.env.NEXT_PUBLIC_LP_PUBLIC_CLIENT_ID, // Must be client app with 'token_endpoint_auth_method set to 'none'
  // no client secret
  accessTokenUri: 'https://auth.laterpay.net/oauth2/token',
  authorizationUri: 'https://auth.laterpay.net/oauth2/auth',
  redirectUri: 'http://localhost:8080',
  scopes: ['read', 'write']
})

export const laterpayConfidentialClient = new ClientOAuth2({
  clientId: process.env.LP_CONFIDENTIAL_CLIENT_ID, // Client app with token_endpoint_auth_method set to 'client_secret_basic'
  clientSecret: process.env.LP_CONFIDENTIAL_CLIENT_SECRET,
  accessTokenUri: 'https://auth.laterpay.net/oauth2/token',
  authorizationUri: 'https://auth.laterpay.net/oauth2/auth',
  redirectUri: 'http://localhost:3000/api/auth/callback',
  scopes: ['read', 'write'],
  state: 'staticState' // nanoid()
})
