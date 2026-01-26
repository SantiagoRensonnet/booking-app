import { useRef, useReducer } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi2";

import { useForm, FormProvider } from "react-hook-form";

import ListViewport from "./ListViewport";
import FilterRow from "./FilterRow";
import Form from "./Form";
import FormRow from "./FormRow";
import ButtonIcon from "./ButtonIcon";
import Button from "./Button";

import { getConditionsByColumnType, reducer } from "../utils/filter";

export default function FilterForm({ columns, defaultValue, closeModal }) {
  //form validation
  const methods = useForm();
  function onSubmit(data) {
    console.log("submitting form...");
    console.log(data);
  }
  function onError(error) {
    console.log("error data", error);
  }

  const [state, dispatch] = useReducer(reducer, {
    columns,
    filters: [
      {
        id: 1,
        type: defaultValue.type,
        label: defaultValue.label,
        criteria: defaultValue.criteria,
        criteriaOptions: columns.map((column) => ({
          label: column.label,
          value: column.name,
        })),
        condition: defaultValue.condition,
        conditionOptions: getConditionsByColumnType(defaultValue),
        ...(defaultValue.min !== undefined && { min: defaultValue.min }),
        ...(defaultValue.max !== undefined && { max: defaultValue.max }),
      },
    ],
  });
  const lastFilterRef = useRef(null);

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit, onError)} type="modal">
        <ListViewport
          childrenLength={state.filters.length}
          childrenMax={3}
          lastChildRef={lastFilterRef}
        >
          {state.filters.map((filter, index) => (
            <FilterRow
              key={filter.id}
              filter={filter}
              labelsLookup={state.columns.reduce(
                (acc, curr) => ({ ...acc, [curr.name]: curr.label }),
                {},
              )}
              rowIndex={index}
              dispatch={dispatch}
              ref={index === state.filters.length - 1 ? lastFilterRef : null}
            />
          ))}
        </ListViewport>

        <FormRow $paddingBottom="0" $border="none" $buttonAlignment="start">
          <ButtonIcon
            disabled={state.filters.length === columns.length}
            onClick={() => {
              const values = methods.getValues();
              dispatch({
                type: "added_filter",
                usedCriteriaArray: Object.keys(values)
                  .filter((key) => key.includes("criteria"))
                  .map((key) => values[key]),
              });
            }}
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
