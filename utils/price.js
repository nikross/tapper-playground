export const numberToPrice = (amount, currency = '') => {
  return currency + (amount / 100).toFixed(2)
}
