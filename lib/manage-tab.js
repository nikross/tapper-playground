import fetch from 'node-fetch'

// Fetch data from Laterpay API
export const getTabForUser = async (userId) => {
  const url = `/v1/tabs/list/${userId}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}
