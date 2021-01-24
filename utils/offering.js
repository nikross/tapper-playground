import format from 'date-fns/format'

export const getOfferingIdFromPhotoId = photoId => {
  const dateStamp = format(new Date(), 'yMMdd')
  const offeringId = `playground-photo-${photoId}-fq89f-${dateStamp}`
  return offeringId
}
