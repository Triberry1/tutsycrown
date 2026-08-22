export const formatCurrency = (
  amount: number,
  currency: string = 'NGN',
  locale: string = 'en-NG'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (
  date: string | Date,
  locale: string = 'en-NG',
  options?: Intl.DateTimeFormatOptions
): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(d)
}

export const formatTime = (
  date: string | Date,
  locale: string = 'en-NG'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export const formatDateTime = (
  date: string | Date,
  locale: string = 'en-NG'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}w ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}

export const formatPhoneNumber = (phone: string): string => {
  // Format for Nigeria
  if (phone.startsWith('0')) {
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
  }
  if (phone.startsWith('+234')) {
    return phone.replace(/(\+234)(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')
  }
  return phone
}

export const formatOrderStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

export const formatNumber = (num: number, locale: string = 'en-NG'): string => {
  return new Intl.NumberFormat(locale).format(num)
}