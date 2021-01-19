// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  const { method } = req
  // console.log({
  //   // url,
  //   // query,
  //   method,
  //   headers,
  //   body
  // })
  if (method === 'POST') {
    res.status(200).json({
      access_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzo2NTA2ZmJkMy1mOTQyLTQ1ZGItYWNiYy03YTU4Y2I0NzM2YTMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOltdLCJjbGllbnRfaWQiOiJjbGllbnQuMWE1Mjk3MDItNmI2MC00MjNkLTg0MDEtZDIxODg5OWU2M2QxIiwiZXhwIjoxNjExMDA2OTE3LCJleHQiOnsibWV0YWRhdGEiOnsiY29uc2VudCI6Im1lcmNoYW50LjMwOGQ3N2IwLTNlMzItNGIwZS1iZWU1LWRkMDI4OWFiODI1NSIsInRlc3RfbW9kZSI6dHJ1ZX0sInJvbGVzIjpbXX0sImlhdCI6MTYxMTAwMzMxNiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmxhdGVycGF5Lm5ldC8iLCJqdGkiOiI3NTg4YTBiZS00MTZlLTQ2ODItOTA1Ni0zNzMwYzAxNjEzNjciLCJuYmYiOjE2MTEwMDMzMTYsInNjcCI6WyJyZWFkIiwid3JpdGUiLCJvZmZsaW5lX2FjY2VzcyJdLCJzdWIiOiJ1c2VyLjE1MTM1YWZlLTQyMWQtNDcxNC05YzY0LWIxZDMxZTFiNjYzOSJ9',
      expires_in: 3600,
      refresh_token: 'NagM6rJVnsM6sEyXSN5ZTqqFHvgwk',
      scope: 'read write offline_access',
      token_type: 'bearer'
    })
    res.end()
    return
  }
  res.status(500).json({ error: 'wrong method' })
}

// export default (req, res) => {
//   res.status(400).json({
//     error: 'invalid_grant',
//     error_verbose: 'The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client',
//     error_description: 'The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client',
//     error_hint: 'The authorization code has already been used.',
//     status_code: 400
//   })
// }
