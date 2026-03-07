import FormTabs from "../FormTabs";
import Select from "../Select";

export default function FilterCondition({
  filter,
  filterNames,
  changeCondition,
}) {
  const isBooleanOrEnum = filter.type === "boolean" || filter.type === "enum";

  if (isBooleanOrEnum) return null;

  return (
    <Select
      name={filterNames.condition}
      options={filter.conditionOptions}
      onChange={changeCondition}
      value={filter.condition}
      controlled
    ></Select>
  );
}
