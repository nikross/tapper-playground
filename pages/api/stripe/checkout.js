const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

/*
1. Get full tab & extract amount
2. Create checkout
3. Wait for success, then call BYOP endpoint
*/

const YOUR_DOMAIN = process.env.NEXTAUTH_URL + '/tab'

export default async (req, res) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }
    if (!req.body.totalAmount || !req.body.tabId) {
      throw new Error('Invalid format')
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Laterpay Tab',
              images: ['https://www2.laterpay.net/wp-content/uploads/2020/04/ex-contribute-band.jpg']
            },
            unit_amount: req.body.totalAmount
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?tab=${req.body.tabId}`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`
    })
    res.status(200).json({ id: session.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
