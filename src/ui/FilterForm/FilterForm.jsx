import { useRef, useReducer } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi2";
import { useForm, FormProvider } from "react-hook-form";

import ListViewport from "../ListViewport";
import FilterRow from "./FilterRow";
import Form from "../Form";
import FormRow from "../FormRow";
import ButtonIcon from "../ButtonIcon";
import Button from "../Button";

import {
  encodeFiltersToParams,
  createInitialState,
  reducer,
} from "../../utils/filters";
import { useURLParams } from "../../hooks/useURLParams";

function getDefaultValues(initialFilters, columns) {
  const defaultValues = {};
  if (initialFilters.length) {
    initialFilters.forEach((filter, index) => {
      const defaultValue = filter.value;
      if (defaultValue) defaultValues[`filter_${index}_value`] = defaultValue;
    });
  } else {
    const firstCol = columns[0];
    if (firstCol.type === "boolean")
      defaultValues[`filter_0_value`] = firstCol.values[0].value;
    else if (firstCol.type === "enum")
      defaultValues[`filter_0_value`] = [firstCol.values[0].value];
  }
  return defaultValues;
}

export default function FilterForm({
  entityName,
  columns,
  lookupTables,
  initialFilters = [],
  layout,
  closeModal,
}) {
  const methods = useForm({
    defaultValues: getDefaultValues(initialFilters, columns),
  });

  const { setURLParamAll, clearURLParamAll } = useURLParams();
  const lastFilterRef = useRef(null);

  const [state, dispatch] = useReducer(
    reducer,
    { entityName, columns, filters: initialFilters },
    createInitialState,
  );

  function onSubmit(data) {
    setURLParamAll("filter", encodeFiltersToParams(entityName, data));
    closeModal?.();
  }
  function onError(error) {
    // console.log(error);
  }

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
              layout={layout}
              lookupTables={lookupTables}
              filter={filter}
              rowIndex={index}
              dispatch={dispatch}
              ref={index === state.filters.length - 1 ? lastFilterRef : null}
            />
          ))}
        </ListViewport>

        <FormRow $buttonAlignment="start">
          <ButtonIcon
            disabled={state.filters.length === columns.length}
            onClick={() => {
              const values = methods.getValues();
              dispatch({
                type: "filter_added",
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
            $variation="secondary"
            type="button"
            onClick={() => {
              clearURLParamAll("filter");
              closeModal?.();
            }}
          >
            Clear all
          </Button>
          <div className="group">
            <Button
              onClick={() => closeModal?.()}
              $variation="secondary"
              type="reset"
            >
              Cancel
            </Button>
            <Button>Apply filters</Button>
          </div>
        </FormRow>
      </Form>
    </FormProvider>
  );
}
