import axios from 'axios'
import getAccessToken from '@/lib/get-access-token'

export default async (req, res) => {
  const BASE_URL = 'https://tapi.sbx.laterpay.net'
  try {
    const {
      method,
      url,
      query: { route: routeArray }
    } = req
    const endpoint = `/${routeArray.join('/')}`
    const queryParamsString = url.indexOf('?') > -1 ? url.substring(url.indexOf('?')) : ''
    const token = await getAccessToken()
    if (endpoint) {
      axios({
        method: method || 'get',
        headers: {
          Authorization: `Bearer ${token}`
        },
        url: `${BASE_URL}${endpoint}${queryParamsString}`
      })
        .then(lpResponse => {
          const { data } = lpResponse
          res.status(200).json({ ...data })
        })
        .catch((error) => {
          const lpResponse = error.response
          if (lpResponse) {
            const { data } = lpResponse
            res.status(401).json({ error: data.error })
          } else {
            res.status(500).json({ error })
          }
        })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}
