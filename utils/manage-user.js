export const handleUserSignout = () => {
  window.sessionStorage.removeItem('userId')
  return null
}

export const handleUserSignin = () => {
  const userId = window.prompt('What\'s your user ID?')
  window.sessionStorage.setItem('userId', userId)
  return userId || null
}

export const retrieveUserIdFromStorage = () => {
  const userId = window.sessionStorage.getItem('userId')
  return userId || null
}
