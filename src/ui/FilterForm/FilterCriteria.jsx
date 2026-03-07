import Select from "../Select";
export default function FilterCriteria({
  filter,
  filterNames,
  changeCriteria,
  validateCriteria,
}) {
  return (
    <Select
      name={filterNames.criteria}
      options={filter.criteriaOptions}
      onChange={changeCriteria}
      value={filter.criteria}
      controlled={true}
      validate={validateCriteria}
    ></Select>
  );
}
