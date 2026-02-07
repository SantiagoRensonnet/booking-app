import { useRef, useReducer } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi2";
import { useForm, FormProvider } from "react-hook-form";

import ListViewport from "./ListViewport";
import FilterRow from "./FilterRow";
import Form from "./Form";
import FormRow from "./FormRow";
import ButtonIcon from "./ButtonIcon";
import Button from "./Button";

import {
  encodeFiltersToParams,
  createInitialState,
  reducer,
} from "../utils/filter";
import { useURLParams } from "../hooks/useURLParams";

export default function FilterForm({
  columns,
  initialFilters = [],
  closeModal,
}) {
  const methods = useForm();
  const { setURLParamAll, clearURLParamAll } = useURLParams();
  const lastFilterRef = useRef(null);

  const { current: labelsLookup } = useRef(
    columns.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.label }), {}),
  );

  const [state, dispatch] = useReducer(
    reducer,
    { filters: initialFilters, columns },
    createInitialState,
  );

  function onSubmit(data) {
    setURLParamAll("filter", encodeFiltersToParams(data));
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
              filter={filter}
              labelsLookup={labelsLookup}
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
