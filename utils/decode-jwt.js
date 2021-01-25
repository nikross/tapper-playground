export const decodeJWT = encodedJWT => {
  const tokenPayload = encodedJWT.split('.')[1]
  const buff = Buffer.from(tokenPayload, 'base64')
  const text = buff.toString('ascii')
  const tokenData = JSON.parse(text)
  return tokenData
}
