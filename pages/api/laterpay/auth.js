import getAuthToken from '../../../lib/get-auth-token'

export default async (req, res) => {
  const data = await getAuthToken()
  res.status(200).json({ ...data })
}
