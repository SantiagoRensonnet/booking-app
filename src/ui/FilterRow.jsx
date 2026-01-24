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
  rowIndex,
  onDelete,
  onCriteriaChange,
  onConditionChange,
  getConditionsByCriteria,
  ref,
}) {
  const {
    register,
    formState: { errors },
    unregister,
    setValue,
    getValues,
    trigger,
  } = useFormContext();

  function changeCriteria(e) {
    if (!e.target.value) return false;
    onCriteriaChange(filter.id, e.target.value); //change filters (ui)

    //change validator values
    setValue(`filter_${filter.id}_criteria`, e.target.value);
    setValue(
      `filter_${filter.id}_condition`,
      getConditionsByCriteria(e.target.value)[0].value,
    );

    //clean input values
    unregister(`filter_${filter.id}_value_min`);
    unregister(`filter_${filter.id}_value_max`);
    unregister(`filter_${filter.id}_value`);

    trigger();
  }
  function changeCondition(e) {
    if (!e.target.value) return false;
    onConditionChange(filter.id, e.target.value);
    const condition = getValues(`filter_${filter.id}_condition`);

    //clean input values
    if (condition === "range") {
      setValue(`filter_${filter.id}_value_min`, "");
      setValue(`filter_${filter.id}_value_max`, "");
    } else if (e.target.value === "range")
      setValue(`filter_${filter.id}_value`);

    trigger();
  }

  function isCriteriaUnique() {
    const values = getValues();
    const count = Object.keys(values)
      .filter((key) => key.includes("criteria"))
      .map((criteria) => values[criteria])
      .reduce((acc, curr) => ({ ...acc, [curr]: (acc[curr] || 0) + 1 }), {});
    return count[filter.criteria] === 1;
  }

  function unregisterAll() {
    unregister(`filter_${filter.id}_criteria`);
    unregister(`filter_${filter.id}_condition`);
    unregister(`filter_${filter.id}_value_min`);
    unregister(`filter_${filter.id}_value_max`);
    unregister(`filter_${filter.id}_value`);
  }

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
        options={filter.criteriaOptions}
        onChange={changeCriteria}
        value={filter.criteria}
        controlled={true}
      ></Select>
      {filter.type === "boolean" ? (
        <FormTabs
          name={`filter_${filter.id}_value`}
          $column="2/4"
          options={filter.conditionOptions}
          controlled={true}
        />
      ) : (
        <>
          <Select
            name={`filter_${filter.id}_condition`}
            options={filter.conditionOptions}
            onChange={changeCondition}
            controlled={true}
          ></Select>
          {filter.type === "number" ? (
            filter.condition === "range" ? (
              <NumberRangeInput
                name={`filter_${filter.id}_value`}
                separator="and"
                min={filter.min}
                max={filter.max}
                filterLabel={filter.label}
                controlled={true}
                validate={() => ({
                  uniqueCriteria:
                    isCriteriaUnique() || `${filter.label} is duplicated`,
                })}
              />
            ) : (
              <Input
                {...register(`filter_${filter.id}_value`, {
                  required: "This field is required",
                  min: {
                    value: filter.min,
                    message: `${filter.label} should be at least ${filter.min}`,
                  },
                  max: {
                    value: filter.max,
                    message: `${filter.label} should be less than ${filter.max}`,
                  },
                  validate: () =>
                    isCriteriaUnique() || `${filter.label} is duplicated`,
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
                  isCriteriaUnique() || `${filter.label} is duplicated`,
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
            onDelete(filter.id);
            unregisterAll();
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
