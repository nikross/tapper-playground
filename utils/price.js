export const numberToPrice = (amount, currencyCode) => {
  const symbols = {
    EUR: '€',
    USD: '$'
  }
  const currency = symbols[currencyCode] || ''
  return currency + (amount / 100).toFixed(2)
}
