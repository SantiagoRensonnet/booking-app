import { useState, useRef } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi2";

import { useForm, FormProvider } from "react-hook-form";

import ListViewport from "./ListViewport";
import FilterRow from "./FilterRow";
import Form from "./Form";
import FormRow from "./FormRow";
import ButtonIcon from "./ButtonIcon";
import Button from "./Button";

function getConditionOptions(column) {
  switch (column.type) {
    case "number":
      return [
        { label: "Equals to", value: "equals" },
        { label: "Less than", value: "less" },
        { label: "Greater than", value: "greater" },
        { label: "Between", value: "range" },
      ];
    case "boolean":
      return column.values;
    default: //str
      return [
        { label: "Contains", value: "contains" },
        { label: "Equals to", value: "equals" },
      ];
  }
}

export default function FilterForm({ columns, defaultValue, closeModal }) {
  //form validation
  const formRef = useRef();
  const methods = useForm();
  function onSubmit(data) {
    const formData = new FormData(formRef.current);
    console.log(formData);
  }
  function onError(error) {
    console.log(error);
  }
  //validation should depend on react-hook-form form state (not filters)
  function isCriteriaUnique(criteria) {
    const values = methods.getValues();
    const formData = new FormData(formRef.current);
    console.log(formData);
    console.log(values);
    return false;
  }

  // ui -> it can be refactored with useReducer (finish first the logic)
  const [filters, setFilters] = useState([
    {
      id: 1,
      type: defaultValue.type,
      criteria: defaultValue.criteria,
      label:defaultValue.label,
      criteriaOptions: columns.map((column) => ({
        label: column.label,
        value: column.name,
      })),
      condition: defaultValue.condition,
      conditionOptions: getConditionOptions(defaultValue),
      ...(defaultValue.min !== undefined && { min: defaultValue.min }),
      ...(defaultValue.max !== undefined && { max: defaultValue.max }),
    },
  ]);
  function addFilter() {
    const used_criteria_array = filters.map((filter) => filter.criteria);
    const unused_columns = columns.filter(
      (column) => !used_criteria_array.includes(column.name)
    );
    if (!unused_columns.length) return false;

    const nextFilter = unused_columns[0];
    const newType = nextFilter.type;
    const newConditionOptions = getConditionOptions(nextFilter);
    const min = nextFilter.min,
      max = nextFilter.max;
    const newFilter = {
      id: filters.at(-1).id + 1,
      type: newType,
      criteria: nextFilter.name,
      label: nextFilter.label,
      criteriaOptions: columns.map((column) => ({
        label: column.label,
        value: column.name,
      })),
      condition: newConditionOptions[0]?.value,
      conditionOptions: newConditionOptions,
      ...(min !== undefined && { min }),
      ...(max !== undefined && { max }),
    };
    setFilters([...filters, newFilter]);
  }
  function deleteFilter(id) {
    setFilters((filters) => filters.filter((filter) => filter.id !== id));
  }
  function handleCriteriaChange(id, newCriteria) {
    const newColumn = columns.find((column) => column.name === newCriteria);
    const newConditionOptions = getConditionOptions(newColumn);
    const min = newColumn.min,
      max = newColumn.max;
    const nextFilters = filters.map((filter) => {
      if (filter.id === id) {
        return {
          ...filter,
          type: newColumn.type,
          label: newColumn.label,
          criteria: newCriteria,
          condition: newConditionOptions[0]?.value,
          conditionOptions: newConditionOptions,
          ...(min !== undefined && { min }),
          ...(max !== undefined && { max }),
        };
      } else return filter;
    });
    setFilters(nextFilters);
  }
  function handleConditionChange(id, newCondition) {
    const nextFilters = filters.map((filter) => {
      if (filter.id === id) {
        return {
          ...filter,
          condition: newCondition,
        };
      } else return filter;
    });
    setFilters(nextFilters);
  }
  const lastFilterRef = useRef(null);

  return (
    <FormProvider {...methods}>
      <Form
        ref={formRef}
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        type="modal"
      >
        <ListViewport
          childrenLength={filters.length}
          childrenMax={3}
          lastChildRef={lastFilterRef}
        >
          {filters.map((filter, index) => (
            <FilterRow
              onCriteriaChange={handleCriteriaChange}
              onConditionChange={handleConditionChange}
              handleDelete={() => deleteFilter(filter.id)}
              isCriteriaUnique = {isCriteriaUnique}
              key={filter.id}
              filter={filter}
              rowIndex={index}
              ref={index === filters.length - 1 ? lastFilterRef : null}
              min={filter.min}
              max={filter.max}
            />
          ))}
        </ListViewport>

        <FormRow $paddingBottom="0" $border="none" $buttonAlignment="start">
          <ButtonIcon
            disabled={filters.length === columns.length}
            onClick={addFilter}
            type="button"
            $alignCenter="true"
          >
            <HiOutlinePlusCircle /> Add filter
          </ButtonIcon>
        </FormRow>
        <FormRow>
          <Button
            onClick={() => closeModal?.()}
            $variation="secondary"
            type="reset"
          >
            Cancel
          </Button>
          <Button>Apply filters</Button>
        </FormRow>
      </Form>
    </FormProvider>
  );
}
