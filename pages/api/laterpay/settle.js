import signedRequest from '../../../lib/signed-request'

export default async (req, res) => {
  const { tabId } = req.query
  console.log({ tabId, method: req.method })
  if (req.method === 'POST' && tabId) {
    await signedRequest({
      method: 'post',
      endpoint: `/v1/payment/finish/${tabId}`
    })
    res.status(200).json({})
    return null
  }
  res.status(500).json({
    error: {
      code: 'wrong_method',
      message: 'Only POST requests are accepted'
    }
  })
}
