import { camelCase } from "./helpers";

// Filter form utils
export const getConditionOptionsByColumn = (column) => {
  switch (column.type) {
    case "string":
      return [
        { label: "Contains", value: "contains" },
        { label: "Equals to", value: "equals" },
      ];
    case "number":
      return [
        { label: "Equals to", value: "equals" },
        { label: "Less than", value: "less" },
        { label: "Greater than", value: "greater" },
        { label: "Between", value: "range" },
      ];
    case "boolean":
      return column.values;
    default:
      throw Error("Unknown type: " + column.type);
  }
};

export const getCriteriaOptionsByColumns = (columns) =>
  columns.map((column) => ({
    label: column.label,
    value: column.name,
  }));

function getColumnsLookupTables(columns) {
  const lookupTables = {
    labelsLookup: {},
    typesLookup: {},
    valuesLookup: {},
  };
  columns.forEach((column) => {
    lookupTables.labelsLookup[column.name] = column.label;
    lookupTables.typesLookup[column.name] = column.type;
    lookupTables.valuesLookup[column.name] = column.values;
  });
  return lookupTables;
}

export function createInitialState({ filters, columns }) {
  const { labelsLookup, typesLookup, valuesLookup } =
    getColumnsLookupTables(columns);
  if (!filters.length) {
    const firstCol = columns[0];
    const conditionOptions = getConditionOptionsByColumn(firstCol);
    return {
      columns,
      filters: [
        {
          id: 0,
          type: firstCol.type,
          label: labelsLookup[firstCol.criteria],
          criteria: firstCol.name,
          criteriaOptions: getCriteriaOptionsByColumns(columns),
          condition: conditionOptions[0].value,
          conditionOptions: conditionOptions,
        },
      ],
    };
  }
  return {
    columns,
    filters: filters.map((filter, index) => {
      return {
        id: index,
        type: typesLookup[filter.criteria],
        label: labelsLookup[filter.criteria],
        criteria: filter.criteria,
        criteriaOptions: getCriteriaOptionsByColumns(columns),
        condition: filter.condition,
        conditionOptions: getConditionOptionsByColumn({
          ...filter,
          type: typesLookup[filter.criteria],
          values: valuesLookup[filter.criteria],
        }),
        ...(filter.value !== undefined && { defaultValue: filter.value }),
        ...(filter.value_min !== undefined && {
          defaultValueMin: filter.value_min,
        }),
        ...(filter.value_max !== undefined && {
          defaultValueMax: filter.value_max,
        }),
        ...(filter.min !== undefined && { min: filter.min }),
        ...(filter.max !== undefined && { max: filter.max }),
      };
    }),
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case "filter_added": {
      const unused_columns = state.columns.filter(
        (column) => !action.usedCriteriaArray.includes(column.name),
      );
      if (!unused_columns.length) return state;

      const nextFilter = unused_columns[0];
      const newType = nextFilter.type;
      const newConditionOptions = getConditionOptionsByColumn(nextFilter);
      const min = nextFilter.min,
        max = nextFilter.max;
      return {
        ...state,
        filters: [
          ...state.filters,
          {
            id: state.filters.at(-1).id + 1,
            type: newType,
            label: nextFilter.label,
            criteria: nextFilter.name,
            criteriaOptions: getCriteriaOptionsByColumns(state.columns),
            condition:
              newType === "boolean" ? "boolean" : newConditionOptions[0].value,
            conditionOptions: newConditionOptions,
            ...(min !== undefined && { min }),
            ...(max !== undefined && { max }),
          },
        ],
      };
    }
    case "filter_deleted": {
      return {
        ...state,
        filters: state.filters.filter((filter) => filter.id !== action.id),
      };
    }
    case "criteria_changed": {
      const newColumn = state.columns.find(
        (column) => column.name === action.newCriteria,
      );
      const newConditionOptions = getConditionOptionsByColumn(newColumn);
      const min = newColumn.min,
        max = newColumn.max;
      return {
        ...state,
        filters: state.filters.map((filter) => {
          if (filter.id === action.id) {
            return {
              ...filter,
              type: newColumn.type,
              label: newColumn.label,
              criteria: newColumn.name,
              condition:
                newColumn.type === "boolean"
                  ? "boolean"
                  : newConditionOptions[0].value,
              conditionOptions: newConditionOptions,
              ...(min !== undefined && { min }),
              ...(max !== undefined && { max }),
            };
          } else return filter;
        }),
      };
    }
    case "condition_changed":
      return {
        ...state,
        filters: state.filters.map((filter) => {
          if (filter.id === action.id) {
            return {
              ...filter,
              condition: action.newCondition,
            };
          } else return filter;
        }),
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
}

// Filter url params utils
export function encodeFiltersToParams(formValues) {
  const params = new URLSearchParams();

  // Group fields by filter index
  const filters = {};

  Object.entries(formValues).forEach(([key, value]) => {
    if (value == null || value === "") return;

    const match = key.match(/^filter_(\d+)_(.+)$/);
    if (!match) return;

    const [, index, field] = match;
    filters[index] ??= {};
    filters[index][field] = value;
  });

  Object.values(filters).forEach((filter) => {
    const { criteria, condition, value, value_min, value_max } = filter;
    if (!criteria) return;

    // Boolean
    if (condition === "boolean" && value) {
      params.set(`filter.${criteria}`, value);
      return;
    }

    // Range
    if (condition === "range") {
      if (value_min == null || value_max == null) return;
      params.set(`filter.${criteria}.range`, `${value_min}..${value_max}`);
      return;
    }

    // Other operators
    if (value == null) return;

    const operatorMap = {
      equals: "eq",
      contains: "contains",
      greater: "gt",
      less: "lt",
    };

    const operator = operatorMap[condition];
    if (!operator) return;

    params.set(`filter.${criteria}.${operator}`, value);
  });

  return params;
}

export function decodeFiltersToParams(searchParams) {
  const filters = [];

  for (const [key, value] of searchParams.entries()) {
    if (
      !key.startsWith("filter.") ||
      (key === "filter.condition" && value === "boolean")
    )
      continue;

    const parts = key.split(".");
    const criteria = parts[1];

    // Boolean: filter.criteria=true
    if (parts.length === 2) {
      filters.push({
        criteria,
        condition: "boolean",
        value,
      });
      continue;
    }

    const operator = parts[2];

    if (operator === "range") {
      const [min, max] = value.split("..");
      filters.push({
        criteria,
        condition: "range",
        value_min: min,
        value_max: max,
      });
      continue;
    }

    const conditionMap = {
      eq: "equals",
      contains: "contains",
      gt: "greater",
      lt: "less",
    };

    filters.push({
      criteria,
      condition: conditionMap[operator],
      value,
    });
  }

  return filters;
}

// Filter table utils
/**
 *
 * Returns an array of objects that have a certain not null field     -- filter value is truthy
 *
 * Returns an array of objects that lack a certain field (or is null) -- filter value is falsy
 *
 * ### Notes
 * If the filter value is null -> the original array will be returned
 *
 * If the filter value is not valid, not in `booleans` -> an empty array will be returned
 *
 *
 * @param {Object[]} array
 * array to be filtered
 *
 * @param {string} key
 * filter key
 *
 * @param {string} value
 * filter value
 *
 * @param {Boolean[]} booleans
 * list of valid filter values interpreted as truthy and falsy respectively
 *
 * @returns {Object[]}
 * Filtered array.
 *
 *
 */
export function filterByKeyExistence(
  array,
  key,
  value,
  booleans = [true, false],
) {
  if (!value) return array;
  if (!booleans.find((bool) => value === bool)) return [];
  return array.filter((el) => (value === booleans[0] ? el[key] : !el[key]));
}

function filterElementByCriteria(element, filter, formatFilterCriteria) {
  const criteria = formatFilterCriteria
    ? formatFilterCriteria(filter.criteria)
    : filter.criteria;
  const element_value = element[criteria];
  switch (filter.condition) {
    case "contains":
      return element_value.includes(filter.value);
    case "equals":
      return (
        element_value ===
        (typeof element_value === "number"
          ? Number(filter.value)
          : filter.value)
      );
    case "greater":
      return element_value > Number(filter.value);
    case "less":
      return element_value < Number(filter.value);
    case "range":
      return (
        element_value > Number(filter.value_min) &&
        element_value < Number(filter.value_max)
      );
    case "boolean":
      return Boolean(element_value);
    default:
      throw Error("Unknown condition: " + filter.condition);
  }
}

export function applyFilters(array, filters) {
  if (!filters || !array?.length) return array;
  return array.filter((item) =>
    filters.reduce((acc, curr) => {
      return acc && filterElementByCriteria(item, curr, camelCase);
    }, true),
  );
}
