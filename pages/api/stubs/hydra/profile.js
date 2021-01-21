export default (req, res) => {
  try {
    console.log(req.headers)
    const authHeader = req.headers.authorization
    const accessToken = authHeader.split('Bearer ')[1]
    const tokenPayload = accessToken.split('.')[1]
    const buff = Buffer.from(tokenPayload, 'base64')
    const text = buff.toString('ascii')
    const tokenData = JSON.parse(text)
    res.status(200).json({
      id: 123,
      laterpayUserId: tokenData.sub,
      name: 'Niklas',
      email: 'nrossmann@laterpay.net',
      picture: null
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
