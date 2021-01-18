import axios from 'axios'

// Fetch data from Laterpay API
export const getTabForUser = async (userId) => {
  const url = `/v1/tabs/list/${userId}`
  try {
    const data = await axios.get(url)
    return data
  } catch (error) {
    console.log(error)
  }
}
