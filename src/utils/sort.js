function lexicographicOrder(a, b) {
  return a < b ? 1 : -1;
}
function numberOrder(a, b) {
  return a - b;
}
export function sortByColumn(array, colName, order) {
  const type = typeof array[0][colName] === "number" ? "number" : "string";
  const modifier = order === "asc" ? 1 : -1;
  return array.sort((a, b) => {
    if (type === "number")
      return modifier * numberOrder(a[colName], b[colName]);
    else return modifier * lexicographicOrder(a[colName], b[colName]);
  });
}