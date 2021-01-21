import { signedRequest } from '@/utils/signed-request'

export const checkAccess = async (offeringId, accessToken) => {
  console.log('checkAccess was triggered')
  const { data } = await signedRequest({
    accessToken: accessToken,
    endpoint: '/v1/access',
    params: {
      merchant_id: process.env.NEXT_PUBLIC_LP_MERCHANT_ID,
      offering_id: offeringId
    }
  })
  return data
}
