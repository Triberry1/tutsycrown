export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `TC-${timestamp}-${suffix}`
}

export function calculateTax(amount: number, rate = 0.075): number {
  return Number((amount * rate).toFixed(2))
}
