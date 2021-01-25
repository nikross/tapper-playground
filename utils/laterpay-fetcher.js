import axios from 'axios'

export const fetchFromLaterpay = async (url, options) => {
  const response = await axios({
    url: `/api/laterpay${url}`,
    ...options
  })
  return response.data
}

export const handleRequest = async (request) => {
  return axios(request)
    .then(response => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || error
    })
}
