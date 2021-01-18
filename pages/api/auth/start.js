import { laterpayConfidentialClient } from '@/lib/oauth'

export default (req, res) => {
  const uri = laterpayConfidentialClient.code.getUri()
  res.redirect(uri)
}
