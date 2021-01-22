// Laterpay doesn't offer a profile/user endpoint, but next-auth will throw an error if no such endpoint is specified.
// This API page serves as a temporary placeholder.
export default (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) throw new Error()
    // Extract Laterpay User ID from access token
    const accessToken = authHeader.split('Bearer ')[1]
    const tokenPayload = accessToken.split('.')[1]
    const buff = Buffer.from(tokenPayload, 'base64')
    const text = buff.toString('ascii')
    const tokenData = JSON.parse(text)
    res.status(200).json({
      id: 123,
      laterpayUserId: tokenData.sub,
      name: 'John Doe',
      email: 'john@doe.com',
      picture: null
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
