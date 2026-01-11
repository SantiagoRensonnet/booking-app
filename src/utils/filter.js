/**
 *
 * Returns an array of objects that have a certain not null field     -- filter value is truthy
 *
 * Returns an array of objects that lack a certain field (or is null) -- filter value is falsy
 *
 * ### Notes
 * If the filter value is null -> the original array will be returned
 *
 * If the filter value is not valid, not in `booleans` -> an empty array will be returned
 *
 *
 * @param {Object[]} array
 * array to be filtered
 *
 * @param {string} key
 * filter key
 *
 * @param {string} value
 * filter value
 *
 * @param {Boolean[]} booleans
 * list of valid filter values interpreted as truthy and falsy respectively
 *
 * @returns {Object[]}
 * Filtered array.
 *
 *
 */
export function filterByKeyExistence(
  array,
  key,
  value,
  booleans = [true, false]
) {
  if (!value) return array;
  if (!booleans.find((bool) => value === bool)) return [];
  return array.filter((el) => (value === booleans[0] ? el[key] : !el[key]));
}
