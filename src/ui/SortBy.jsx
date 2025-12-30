import Select from "../ui/Select";
import { useURLParams } from "../hooks/useUrlParams";
export default function SortBy({ options }) {
  const { getURLParam, setURLParam } = useURLParams();
  const sortBy = getURLParam("sort_by") || "";
  return (
    <Select
      value={sortBy}
      options={options}
      type="white"
      onChange={(e) => setURLParam("sort_by", e.target.value)}
    />
  );
}
