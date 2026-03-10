import Select from "../Select";
export default function FilterCriteria({
  filter,
  filterName,
  changeCriteria,
  validateCriteria,
}) {
  return (
    <Select
      name={filterName}
      options={filter.criteriaOptions}
      onChange={changeCriteria}
      value={filter.criteria}
      controlled={true}
      validate={validateCriteria}
    ></Select>
  );
}
