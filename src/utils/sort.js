import { camelCase } from "./helpers";

function lexicographicOrder(a, b) {
  return a > b ? 1 : -1;
}
function numberOrder(a, b) {
  return a - b;
}
function dateOrder(a, b) {
  return Date.parse(a) > Date.parse(b) ? 1 : -1;
}
export function decodeParamsToSort(sortParam, opts = {}) {
  const { defaultOrder = ".", paramsMappingFn = (arg) => arg } = opts;
  return paramsMappingFn(sortParam ? sortParam : defaultOrder).split(".");
}
function isValidDate(strDate) {
  return !isNaN(Date.parse(strDate));
}
function getColumnType(val) {
  if (isValidDate(val)) return "date";
  if (typeof val === "number") return "number";
  return "string";
}
export function sortByColumn(array, column, direction) {
  if (!array?.length) return array;
  const type = getColumnType(array[0][column]);
  const modifier = direction === "asc" ? 1 : -1;
  return array.sort((a, b) => {
    if (type === "date") return modifier * dateOrder(a[column], b[column]);
    if (type === "number") return modifier * numberOrder(a[column], b[column]);
    else return modifier * lexicographicOrder(a[column], b[column]);
  });
}
