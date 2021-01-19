// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.status(200).json({
    id: '123',
    name: 'Niklas',
    email: 'nrossmann@laterpay.net',
    picture: 'http://localhost:3000'
  })
}
