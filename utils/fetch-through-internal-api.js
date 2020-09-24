/* global fetch */
const INTERNAL_API_BASE_URL = 'http://localhost:3000/api/laterpay'

const fetchThroughInternalApi = async (url) => {
  const response = await fetch(`${INTERNAL_API_BASE_URL}${url}`)
  const data = await response.json()
  return data
}

export default fetchThroughInternalApi
