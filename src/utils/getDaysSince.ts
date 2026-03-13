/**
 * Returns the number of days since the given date.
 * @module utils/getDaysSince
 * @param {Date} date - The date to compare to.
 * @returns {number} The number of days since the given date.
 */
const getDaysSince = (date: Date): number => {
  // throw an error if the date is invalid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date object')
  }
  const now = new Date()
  const lastUploadDate = new Date(date)
  const nowUtc = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
  const lastUploadUtc = Date.UTC(
    lastUploadDate.getFullYear(),
    lastUploadDate.getMonth(),
    lastUploadDate.getDate()
  )

  return Math.floor((nowUtc - lastUploadUtc) / (1000 * 3600 * 24))
}

export default getDaysSince
