import axios from 'axios'

export const fetchFromLaterpay = async (url, { accessToken, ...axiosConfig }) => {
  const response = await axios({
    ...axiosConfig,
    url: `/api/laterpay${url}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.data
}
