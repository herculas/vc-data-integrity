/**
 * Converts a Date object, a number, or a string to a W3C timestamp string.
 * @param {Date | number | string} [date] The date to convert.
 *
 * @returns {string} The W3C timestamp string.
 */
export function toW3CTimestampString(date?: Date | number | string): string {
  if (!date) {
    date = new Date()
  } else if (typeof date === "number" || typeof date === "string") {
    date = new Date(date)
  }
  const str = date.toISOString()
  return str.substring(0, str.length - 5) + "Z"
}
