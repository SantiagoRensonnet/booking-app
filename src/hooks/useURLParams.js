import { useSearchParams } from "react-router";
export function useURLParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  function setURLParam(name, value) {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(name, value) : newParams.delete(name);
    setSearchParams(newParams);
  }
  function getURLParam(key) {
    return searchParams.get(key);
  }
  function getURLParamAll(keyword) {
    if (!keyword) return searchParams;
    const arr = [];
    searchParams.forEach((value, key) => {
      if (key.includes(keyword)) arr.push([key, value]);
    });
    return new Map(arr);
  }

  function deleteParamsByKeyword(keyword, searchParams) {
    const keys = [...searchParams.keys()].filter((key) =>
      key.includes(keyword),
    );
    for (const key of keys) {
      searchParams.delete(key);
    }
  }
  function clearURLParamAll(keyword) {
    const newParams = new URLSearchParams(searchParams);
    deleteParamsByKeyword(keyword, newParams);
    setSearchParams(newParams);
  }
  function setURLParamAll(keyword, values) {
    const newParams = new URLSearchParams(searchParams);
    deleteParamsByKeyword(keyword, newParams);
    values.forEach((value, key) => {
      if (key.includes(keyword) && value) newParams.set(key, value);
    });
    setSearchParams(newParams);
  }
  return { getURLParam, setURLParam, getURLParamAll, setURLParamAll,clearURLParamAll };
}
