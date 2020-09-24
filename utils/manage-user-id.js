export const getUserId = () => {
  let userId = window.localStorage.getItem('userId')
  if (!userId) userId = handleSigninUser()
  return userId
}

export const handleSigninUser = () => {
  const userId = window.prompt('What\'s your user ID?')
  window.localStorage.setItem('userId', userId)
  return userId
}
