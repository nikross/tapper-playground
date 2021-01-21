import axios from 'axios'

export const signedRequest = async ({ method, endpoint, headers, accessToken, ...rest }) => {
  const BASE_URL = 'https://tapi.laterpay.net'
  return axios({
    method: method || 'get',
    url: `${BASE_URL}${endpoint}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...headers
    },
    ...rest
  })
    .then(response => {
      console.log(response)
      return response.data
    })
    .catch((error) => {
      const errorResponse = error.response || error
      return errorResponse.data || errorResponse
    })
}
