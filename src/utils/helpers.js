import { formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const filenameAddUniqueSuffix = (filename) => {
  if (!filename) return null;
  const array = filename.split(".");
  const extension = array.pop();
  return `${array.join(".")}_${makeid(3)}.${extension}`;
};

export const getFilename = (path) => path?.split("/")?.pop();

export const camelCase = (str) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );

// Filtering
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

//Sorting
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
