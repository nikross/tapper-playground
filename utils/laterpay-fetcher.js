import axios from 'axios'

export const fetchFromLaterpay = async (url, options) => {
  const response = await axios({
    url: `/api/laterpay${url}`,
    ...options
  })
  return response.data
}
