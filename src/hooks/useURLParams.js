import { useSearchParams } from "react-router";
export function useURLParams(defaultInit) {
  const [searchParams, setSearchParams] = useSearchParams(defaultInit);
  function setURLParam(name, value, { clearParams } = {}) {
    const newParams = new URLSearchParams(searchParams);
    if (clearParams) {
      clearParams.forEach((key) => newParams.delete(key));
    }
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
  function clearURLParamAll(keyword, { clearParams } = {}) {
    const newParams = new URLSearchParams(searchParams);
    deleteParamsByKeyword(keyword, newParams);
    if (clearParams) {
      clearParams.forEach((key) => newParams.delete(key));
    }
    setSearchParams(newParams);
  }
  function setURLParamAll(keyword, values, { clearParams } = {}) {
    const newParams = new URLSearchParams(searchParams);
    deleteParamsByKeyword(keyword, newParams);
    if (clearParams) {
      clearParams.forEach((key) => newParams.delete(key));
    }
    values.forEach((value, key) => {
      if (key.includes(keyword) && value) newParams.set(key, value);
    });
    setSearchParams(newParams);
  }
  return {
    getURLParam,
    setURLParam,
    getURLParamAll,
    setURLParamAll,
    clearURLParamAll,
  };
}
