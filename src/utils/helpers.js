export const getAvatarText = (name) => {
  const nameParts = name.trim().split(' ').filter(Boolean)

  const initials = nameParts.slice(0, 2).map((part) => part[0].toUpperCase())

  return initials.join('')
}

// Helper function to format date as YYYY/MM/DD
export const formatDateForSubmission = (date) => {
  if (!date) return null

  // Handle if date is already a Date object
  const dateObj = date instanceof Date ? date : new Date(date)

  // Check if date is valid
  if (isNaN(dateObj.getTime())) return null

  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
