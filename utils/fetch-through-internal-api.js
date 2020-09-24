/* global fetch */
const fetchThroughInternalApi = async (url) => {
  const response = await fetch(`/api/laterpay${url}`)
  const data = await response.json()
  return data
}

export default fetchThroughInternalApi
