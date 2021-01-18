import axios from 'axios'
// import { laterpayConfidentialClient } from '@/lib/oauth'

export default async (req, res) => {
  const {
    query: { code }
  } = req

  const {
    LP_CONFIDENTIAL_CLIENT_ID,
    LP_CONFIDENTIAL_CLIENT_SECRET
  } = process.env

  const params = new URLSearchParams()
  params.append('grant_type', 'authorization_code')
  params.append('code', code)
  params.append('client_id', LP_CONFIDENTIAL_CLIENT_ID)
  params.append('redirect_uri', 'http://localhost:3000/api/auth/callback')

  axios.post('https://auth.laterpay.net/oauth2/token', params, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Basic ' + Buffer.from((LP_CONFIDENTIAL_CLIENT_ID + ':' + LP_CONFIDENTIAL_CLIENT_SECRET)).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(({ data }) => {
      console.log(data)
      res.status(200).json(data)
    })
    .catch((error) => {
      const errorResponse = error.response || error
      res.status(500).json(errorResponse.data || errorResponse)
      res.end()
    })

  // try {
  //   const { accessToken } = await laterpayConfidentialClient.code.getToken(req.url)
  //   console.log(accessToken)
  //   res.status(200).json({ accessToken: accessToken || 'undefined' })
  // } catch (error) {
  //   console.log(error)
  //   res.status(500).json({ error: error.message || 'undefined' })
  // }
}

export const config = {
  api: {
    externalResolver: true
  }
}
