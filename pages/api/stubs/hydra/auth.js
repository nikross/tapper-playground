// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.statusCode = 200
  // const uri = `http://${req.headers.host}/api/auth/callback?code=123&state=staticState`
  const uri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?code=jdrmvQztSp8i0x5uThKjsBpM4d1BV-iuOZo42636uJs.rZ3VIR3BnYysq44GjG9kWW5zTD6PJ0h0dposMuQrBic&scope=read%20write%20offline_access&state=staticState`
  res.redirect(uri)
}
