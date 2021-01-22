import axios from 'axios'
import { getSession } from 'next-auth/client'
import qs from 'qs'

const BASE_URL = 'https://tapi.laterpay.net'

const handleRequest = async (request) => {
  return axios(request)
    .then(response => {
      return response.data
    })
    .catch((error) => {
      const errorResponse = error.response || error
      return errorResponse.data || errorResponse
    })
}

export default async (req, res) => {
  const session = await getSession({ req })
  const { route, ...params } = req.query
  const pathname = `/${route.join('/')}`
  try {
    const { accessToken, user } = session
    if (!accessToken) {
      const err = new Error('access token missing')
      err.status = 403
      throw err
    }
    // Prepare request object for call to Laterpay API
    const requestObject = {
      url: BASE_URL + pathname,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    if (!route[1]) {
      const err = new Error('invalid route')
      err.status = 404
      throw err
    }

    switch (route[1]) { // route array example: ['v1', 'payment', 'finish', tabId]
      // Check if user has access
      case 'access':
        requestObject.params = {
          merchant_id: process.env.LP_MERCHANT_ID,
          ...params
        }
        break
      // Make a purchase
      case 'purchase':
        requestObject.method = 'post'
        requestObject.data = req.body
        break
      // List Tabs
      case 'tabs':
        requestObject.params = params
        break
      case 'payment':
        // Settle Tab via /v1/payment/finish/{tab_id}
        if (route[2] === 'finish') {
          // Switch current token with client_credentials token
          const clientCredentials = await handleRequest({
            url: 'https://auth.laterpay.net/oauth2/token',
            method: 'post',
            headers: {
              Authorization: 'Basic ' + Buffer.from((process.env.LP_CLIENT_ID + ':' + process.env.LP_CLIENT_SECRET)).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
              grant_type: 'client_credentials',
              scope: 'read write'
            })
          })
          // Throw an error if the user doesn't own the Tab
          const tabId = route[3]
          const tab = await handleRequest({
            url: `${BASE_URL}/v1/tabs/${tabId}`,
            headers: {
              Authorization: `Bearer ${clientCredentials.access_token}`
            }
          })
          if (tab.user_id !== user.id) {
            res.status(200).json({
              error: {
                message: 'User is not the owner of this Tab'
              }
            })
            res.end()
            return
          }
          requestObject.method = 'post'
          // Use the client_credentials access token to settle the Tab
          requestObject.headers.Authorization = `Bearer ${clientCredentials.access_token}`
        }
        break
      default:
        res.status(404).json({ error: 'route not found' })
        res.end()
        return
    }
    const laterpayJsonResponse = await handleRequest(requestObject)
    res.status(200).json(laterpayJsonResponse)
  } catch (error) {
    res.status(error.status || 500).json({
      error: {
        message: error.message
      }
    })
  }
}
