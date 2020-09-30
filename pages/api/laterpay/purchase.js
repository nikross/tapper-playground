import signedRequest from '../../../lib/signed-request'

export default async (req, res) => {
  if (req.method === 'POST') {
    const data = await signedRequest({
      method: 'post',
      endpoint: '/v1/tabs/purchase/item',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        summary: 'Contribution',
        offering_id: 'playground_contribution',
        user_id: req.body.user_id,
        cost: req.body.cost,
        currency: 'EUR',
        payment_model: req.body.payment_model,
        sales_model: 'contribution',
        ...req.body
      }
    })
    res.status(200).json(data)
    return
  }
  res.status(500).json({
    error: {
      code: 'wrong_method',
      message: 'Only POST requests are accepted'
    }
  })
}
