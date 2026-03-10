import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { HiXMark } from "react-icons/hi2";

import FormRow from "../FormRow";
import ButtonIcon from "../ButtonIcon";

import FilterCondition from "./FilterCondition";
import FilterCriteria from "./FilterCriteria";
import FilterValue from "./FilterValue";

export default function FilterRow({
  filter,
  lookupTables,
  layout,
  rowIndex,
  dispatch,
  ref,
}) {
  const {
    formState: { errors },
    unregister,
    setValue,
    getValues,
    trigger,
  } = useFormContext();

  const { typesLookup, labelsLookup, valuesLookup } = lookupTables;

  const baseName = `filter_${filter.id}`;
  const filterNames = {
    criteria: `${baseName}_criteria`,
    condition: `${baseName}_condition`,
    value: `${baseName}_value`,
    valueMin: `${baseName}_value_min`,
    valueMax: `${baseName}_value_max`,
    valueRange: `${baseName}_value_range`,
  };

  function changeCriteria(e) {
    if (!e.target.value) return false;

    dispatch({
      type: "criteria_changed",
      id: filter.id,
      newCriteria: e.target.value,
    });

    //change validator values
    setValue(filterNames.criteria, e.target.value);

    // //clean input values
    unregister(filterNames.valueMin);
    unregister(filterNames.valueMax);
    unregister(filterNames.value);

    const values = valuesLookup[e.target.value];
    const type = typesLookup[e.target.value];
    const filterAllValue = values
      ? type === "enum"
        ? [values[0]?.value]
        : values[0]?.value
      : null;
    if (filterAllValue) {
      setValue(filterNames.value, filterAllValue);
    }

    if (Object.keys(errors).length) trigger();
  }
  function changeCondition(e) {
    if (!e.target.value) return false;
    dispatch({
      type: "condition_changed",
      id: filter.id,
      newCondition: e.target.value,
    });
    const condition = getValues(filterNames.condition);

    // //clean input values
    if (condition === "range") {
      setValue(filterNames.valueMin, null);
      setValue(filterNames.valueMax, null);
    } else if (e.target.value === "range") setValue(filterNames.value, null);

    if (Object.keys(errors).length) trigger();
  }

  function validateCriteria() {
    const values = getValues();
    const current_criteria = getValues(filterNames.criteria);

    const count = Object.keys(values)
      .filter((key) => key.includes("criteria"))
      .map((criteria) => values[criteria])
      .reduce((acc, curr) => ({ ...acc, [curr]: (acc[curr] || 0) + 1 }), {});

    return (
      count[current_criteria] === 1 ||
      `${labelsLookup[current_criteria]} is duplicated`
    );
  }

  function unregisterAll() {
    unregister(filterNames.criteria);
    unregister(filterNames.condition);
    unregister(filterNames.valueMin);
    unregister(filterNames.valueMax);
    unregister(filterNames.value);
  }

  useEffect(() => {
    setValue(`filter_${filter.id}_condition`, filter.condition);
  }, [filter.id, filter.condition, setValue]);

  return (
    <FormRow
      $buttonAlignment="none"
      $columns={layout?.columns ?? "14rem 14rem 22rem 3em 1fr"}
      ref={ref}
      $border="none"
      error={
        errors[filterNames.criteria]?.message ??
        errors[filterNames.value]?.message ??
        errors[filterNames.valueRange]?.message ??
        errors[filterNames.valueMin]?.message ??
        errors[filterNames.valueMax]?.message
      }
    >
      <FilterCriteria
        filter={filter}
        filterName={filterNames.criteria}
        changeCriteria={changeCriteria}
        validateCriteria={validateCriteria}
      />
      <FilterCondition
        filter={filter}
        filterName={filterNames.condition}
        changeCondition={changeCondition}
      />
      <FilterValue
        filterName={filterNames.value}
        filter={filter}
        layout={layout}
      />
      {rowIndex > 0 ? (
        <ButtonIcon
          onClick={() => {
            dispatch({
              type: "filter_deleted",
              id: filter.id,
            });
            unregisterAll();
            if (Object.keys(errors).length) trigger();
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
