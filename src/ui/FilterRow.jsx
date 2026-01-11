import { HiXMark } from "react-icons/hi2";

import FormRow from "./FormRow";
import FormTabs from "./FormTabs";
import Input from "./Input";
import NumberRangeInput from "./NumberRangeInput";
import Select from "./Select";
import ButtonIcon from "./ButtonIcon";

export default function FilterRow({
  filter,
  handleDelete,
  rowIndex,
  onCriteriaChange,
  onConditionChange,
  ref,
}) {
  function changeCriteria(e) {
    if (!e.target.value) return false;
    onCriteriaChange(filter.id, e.target.value);
  }
  function changeCondition(e) {
    if (!e.target.value) return false;
    onConditionChange(filter.id, e.target.value);
  }
  return (
    <FormRow
      $buttonAlignment="none"
      $columns={
        filter.type === "boolean" ? "24rem 1fr 3em" : "24rem 14rem 1fr 3em"
      }
      ref={ref}
      $border="none"
    >
      <Select
        name={`filter_${filter.id}_criteria`}
        value={filter.criteria}
        options={filter.criteriaOptions}
        onChange={changeCriteria}
      ></Select>
      {filter.type === "boolean" ? (
        <FormTabs
          name={`filter_${filter.id}_value`}
          options={[
            { value: "", label: "All" },
            { value: "true", label: "With discount" },
            { value: "false", label: "No discount" },
          ]}
        />
      ) : (
        <>
          <Select
            name={`filter_${filter.id}_condition`}
            options={filter.conditionOptions}
            forceValue={filter.condition}
            onChange={changeCondition}
          ></Select>
          {filter.type === "number" ? (
            filter.condition === "range" ? (
              <NumberRangeInput
                name={`filter_${filter.id}_value`}
                separator="and"
                min={filter.min}
                max={filter.max}
              />
            ) : (
              <Input
                name={`filter_${filter.id}_value`}
                type="number"
                required
                min={filter.min}
                max={filter.max}
              />
            )
          ) : (
            <Input
              name={`filter_${filter.id}_value`}
              type="text"
              required
              min={filter.min}
              max={filter.max}
            />
          )}
        </>
      )}
      {rowIndex > 0 && (
        <ButtonIcon onClick={() => handleDelete(filter.id)} type="button">
          <HiXMark />
        </ButtonIcon>
      )}
    </FormRow>
  );
}
