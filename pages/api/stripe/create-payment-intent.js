const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }
    if (!req.body.tabId || !req.body.totalAmount) {
      throw new Error('Invalid format')
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.totalAmount,
      currency: 'usd',
      metadata: {
        tabId: req.body.tabId
      }
    },
    {
      idempotencyKey: req.body.tabId // https://stripe.com/docs/api/idempotent_requests
    })
    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
