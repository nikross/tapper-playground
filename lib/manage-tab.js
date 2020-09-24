import fetch from 'node-fetch'

const INTERNAL_API_BASE_URL = 'http://localhost:3000/api/laterpay'

// Fetch data from Laterpay API
export const getTabForUser = async (userId) => {
  const url = `${INTERNAL_API_BASE_URL}${'/v1/tabs/list'}/${userId}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    // console.log({ data })
    return data
  } catch (error) {
    console.log(error)
  }
}
