import getAccessToken from '@/lib/get-access-token'

export default async (req, res) => {
  const token = await getAccessToken()
  res.status(200).json({ token })
}
