import { useFormContext } from "react-hook-form";

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
  isCriteriaUnique,
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
  const {
    register,
    formState: { errors },
    unregister,
    watch,
    trigger,
  } = useFormContext();

  const watchAllFields = watch();
  console.log(watchAllFields);
  
  return (
    <FormRow
      $buttonAlignment="none"
      $columns="14rem 14rem 22rem 3em 1fr"
      ref={ref}
      $border="none"
      error={
        errors[`filter_${filter.id}_value`]?.message ??
        errors[`filter_${filter.id}_value_min`]?.message ??
        errors[`filter_${filter.id}_value_max`]?.message
      }
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
          $column="2/4"
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
                errorLabel={filter.criteria}
                controlled={true}
                validate={() =>
                  isCriteriaUnique(filter.criteria) ||
                  `${filter.label} is duplicated`
                }
              />
            ) : (
              <Input
                {...register(`filter_${filter.id}_value`, {
                  required: "This field is required",
                  min: {
                    value: filter.min,
                    message: `${filter.criteria} should be at least ${filter.min}`,
                  },
                  max: {
                    value: filter.max,
                    message: `${filter.criteria} should be less than ${filter.max}`,
                  },
                  validate: () =>
                    isCriteriaUnique(filter.criteria) ||
                    `${filter.label} is duplicated`, 
                })}
                type="number"
                aria-invalid={
                  errors[`filter_${filter.id}_value`] ? "true" : "false"
                }
              />
            )
          ) : (
            <Input
              {...register(`filter_${filter.id}_value`, {
                required: "This field is required",
                validate: () =>
                  isCriteriaUnique(filter.criteria) ||
                  `${filter.label} is duplicated`,
              })}
              type="text"
              aria-invalid={
                errors[`filter_${filter.id}_value`] ? "true" : "false"
              }
            />
          )}
        </>
      )}
      {rowIndex > 0 ? (
        <ButtonIcon
          onClick={() => {
            handleDelete(filter.id);
            unregister(`filter_${filter.id}_value`);
            trigger();
          }}
          type="button"
        >
          <HiXMark />
        </ButtonIcon>
      ) : (
        <div></div>
      )}
    </FormRow>
  );
}
