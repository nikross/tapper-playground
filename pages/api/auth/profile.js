// Laterpay doesn't offer a profile/user endpoint (yet), but next-auth will throw an error if no such endpoint is specified.
// This API page serves as a temporary placeholder.
export default (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) throw new Error('Authorization header is missing')
    // Decode access token
    const accessToken = authHeader.split('Bearer ')[1]
    const tokenPayload = accessToken.split('.')[1]
    const buff = Buffer.from(tokenPayload, 'base64')
    const text = buff.toString('ascii')
    const tokenData = JSON.parse(text)
    // Extract Laterpay User ID
    const laterpayUserId = tokenData.sub
    res.status(200).json({
      userId: laterpayUserId
      // name: `John Doe`,
      // email: `user@test.com`,
      // picture: `https://i.pravatar.cc/150`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
