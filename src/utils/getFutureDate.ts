/**
 * Calculates a date in the future and returns it as ISO
 * @module utils/getFutureDate
 */

/**
 * Get a future date as an ISO string.
 * @param {Date} date The date to format.
 * @param {number} daysToAdd The number of days to add to the date.
 * @returns {TDateISO} The resultant date as an ISO string.
 */
const getFutureDate = (
  daysToAdd: number,
  date: Date = new Date()
): TDateISO => {
  const result = new Date(date)
  result.setDate(result.getDate() + daysToAdd)
  return result.toISOString()
}

export default getFutureDate
