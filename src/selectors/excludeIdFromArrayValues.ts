/**
 * Excludes the id property from an array of objects
 * @module selectors/excludeIdFromArrayValues
 * @param {Array<T>} array
 * @returns {Array<T>}
 */
const excludeIdFromArrayValues = <T extends { id: string }>(
  array: T[]
): Omit<T, 'id'>[] => array.map(({ id: _id, ...rest }) => rest)

export default excludeIdFromArrayValues
