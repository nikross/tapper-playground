import { getSession } from 'next-auth/client'
import { handleRequest } from '@/utils/laterpay-fetcher'

export default async (req, res) => {
  const session = await getSession({ req })
  try {
    if (!session) {
      throw new Error('Not signed in')
    }
    const { accessToken } = session
    const dataResponse = await handleRequest({
      url: 'https://tapi.laterpay.net/v1/purchases/csv',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        merchant_id: process.env.LATERPAY_MERCHANT_ID
      }
    })
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.status(200).send(dataResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
