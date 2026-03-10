import Select from "../Select";

export default function FilterCondition({
  filter,
  filterName,
  changeCondition,
}) {
  const isBooleanOrEnum = filter.type === "boolean" || filter.type === "enum";

  if (isBooleanOrEnum) return null;

  return (
    <Select
      name={filterName}
      options={filter.conditionOptions}
      onChange={changeCondition}
      value={filter.condition}
      controlled
    ></Select>
  );
}
