// Laterpay doesn't offer a profile/user endpoint, but next-auth will throw an error if no such endpoint is specified.
// This API page serves as a temporary placeholder.
export default (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) throw new Error('missing auth header')
    // Extract Laterpay User ID from access token
    const accessToken = authHeader.split('Bearer ')[1]
    const tokenPayload = accessToken.split('.')[1]
    const buff = Buffer.from(tokenPayload, 'base64')
    const text = buff.toString('ascii')
    const tokenData = JSON.parse(text)
    const laterpayUserId = tokenData.sub
    // const id = nanoid()
    res.status(200).json({
      id: laterpayUserId,
      name: `John ${laterpayUserId}`,
      email: `${laterpayUserId}@user.com`,
      picture: `https://i.pravatar.cc/150?${laterpayUserId}`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
