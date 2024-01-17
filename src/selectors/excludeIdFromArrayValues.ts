/**
 * Excludes the id property from an array of objects
 * @module selectors/excludeIdFromArrayValues
 * @param {Array<T>} array
 * @returns {Array<T>}
 */
const excludeIdFromArrayValues = <T extends { id: string }>(
  array: T[]
): Omit<T, 'id'>[] =>
  // disable eslint rule for this line because we need to exclude the id property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  array.map(({ id, ...rest }) => rest)

export default excludeIdFromArrayValues
