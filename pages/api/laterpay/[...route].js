import axios from 'axios'

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
  const { route, ...params } = req.query
  const pathname = `/${route.join('/')}`
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      const err = new Error('access token missing')
      err.status = 403
      throw err
    }
    const accessToken = authHeader.split('Bearer ')[1]
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
        // Settling Tab via /v1/payment/finish/{tab_id}
        if (route[2] === 'finish') {
          console.log('settle', { pathname })
          requestObject.method = 'post'
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
      error: error.message
    })
  }
}
