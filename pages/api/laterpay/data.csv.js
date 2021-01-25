import { getSession } from 'next-auth/client'
import qs from 'qs'
import { handleRequest } from '@/utils/laterpay-fetcher'

export default async (req, res) => {
  const session = await getSession({ req })
  try {
    if (!session) {
      throw new Error('Not signed in')
    }
    // const { user } = session
    const clientCredentials = await handleRequest({
      url: 'https://auth.laterpay.net/oauth2/token',
      method: 'post',
      headers: {
        Authorization: 'Basic ' + Buffer.from((process.env.LATERPAY_CLIENT_ID + ':' + process.env.LATERPAY_CLIENT_SECRET)).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        grant_type: 'client_credentials',
        scope: 'read write'
      })
    })
    const dataResponse = await handleRequest({
      url: 'https://tapi.laterpay.net/v1/purchases/csv',
      headers: {
        Authorization: `Bearer ${clientCredentials.access_token}`
      },
      params: {
        merchant_id: process.env.LATERPAY_MERCHANT_ID
        // user_id: user.id // Adding user_id will result in an empty response. Using auth_code token will result in 403 Forbidden
      }
    })
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.status(200).send(dataResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
