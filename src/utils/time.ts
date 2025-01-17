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

export function assertTime(date: Date, delta: number, created?: string) {
  if (delta !== Infinity) {
    const expected = date.getTime()
    const deltaMilliseconds = delta * 1000
    if (!created) {
      throw new Error("Proof does not contain a creation date!")
    }
    const createdDate = new Date(created).getTime()
    if (createdDate < expected - deltaMilliseconds || createdDate > expected + deltaMilliseconds) {
      throw new Error("Proof creation date is outside of the allowed time window!")
    }
  }
}
