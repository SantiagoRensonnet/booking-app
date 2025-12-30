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
  return { getURLParam, setURLParam };
}
