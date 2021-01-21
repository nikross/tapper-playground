import axios from 'axios'

const BASE_URL = 'https://tapi.laterpay.net'

const signedRequest = async ({ endpoint, ...rest }) => {
  return axios({
    url: BASE_URL + endpoint,
    ...rest
  })
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

    switch (pathname) {
      case '/v1/access':
        requestObject.params = {
          merchant_id: process.env.NEXT_PUBLIC_LP_MERCHANT_ID,
          ...params
        }
        break
      case '/v1/purchase':
        requestObject.method = 'post'
        requestObject.data = req.body
        break
      case '/v1/tabs':
        requestObject.params = params
        break
      default:
        res.status(404).json({ error: 'route not found' })
        res.end()
    }
    const laterpayJsonResponse = await signedRequest(requestObject)
    res.status(200).json(laterpayJsonResponse)
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    })
  }
}
