import { columnLookupTableByEntity } from "./tables";

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
    case "date":
      return [
        { label: "Equals to", value: "equals" },
        { label: "Before", value: "less" },
        { label: "After", value: "greater" },
        { label: "Between", value: "range" },
      ];
    case "boolean":
      return column.values;
    case "enum":
      return column.values;
    default:
      throw Error("Unknown type: " + column.type);
  }
};

function getFilterCondition(type, conditions) {
  return type === "boolean" || type === "enum" ? type : conditions[0].value;
}

const getCriteriaOptionsByColumns = (columns) =>
  columns.map((column) => ({
    label: column.label,
    value: column.name,
  }));

export function createInitialState({ entityName, columns, filters }) {
  const { labelsLookup, typesLookup, valuesLookup, numConstraintsLookup } =
    columnLookupTableByEntity[entityName];

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
          condition: getFilterCondition(firstCol.type, conditionOptions),
          conditionOptions: conditionOptions,
          columnFilterAllName:
            firstCol.type === "boolean" || firstCol.type === "enum"
              ? conditionOptions[0].value
              : null,
          min: firstCol.min ?? null,
          max: firstCol.max ?? null,
        },
      ],
    };
  }
  return {
    columns,
    filters: filters.map((filter, index) => {
      const filterType = typesLookup[filter.criteria];
      const conditionOptions = getConditionOptionsByColumn({
        ...filter,
        type: filterType,
        values: valuesLookup[filter.criteria],
      });
      return {
        id: index,
        type: typesLookup[filter.criteria],
        label: labelsLookup[filter.criteria],
        criteria: filter.criteria,
        criteriaOptions: getCriteriaOptionsByColumns(columns),
        condition: filter.condition,
        conditionOptions: conditionOptions,
        defaultValue: filter.value ?? null,
        defaultValueMin: filter.value_min ?? null,
        defaultValueMax: filter.value_max ?? null,
        columnFilterAllName:
          filterType === "boolean" || filterType === "enum"
            ? conditionOptions[0].value
            : null,
        min: numConstraintsLookup[filter.criteria].min ?? null,
        max: numConstraintsLookup[filter.criteria].max ?? null,
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
      const min = nextFilter.min ?? null,
        max = nextFilter.max ?? null;
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
            condition: getFilterCondition(newType, newConditionOptions),
            conditionOptions: newConditionOptions,
            columnFilterAllName:
              newType === "boolean" || newType === "enum"
                ? newConditionOptions[0].value
                : null,
            min,
            max,
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
      const min = newColumn.min ?? null,
        max = newColumn.max ?? null;
      return {
        ...state,
        filters: state.filters.map((filter) => {
          if (filter.id === action.id) {
            return {
              ...filter,
              type: newColumn.type,
              label: newColumn.label,
              criteria: newColumn.name,
              condition: getFilterCondition(
                newColumn.type,
                newConditionOptions,
              ),
              conditionOptions: newConditionOptions,
              columnFilterAllName:
                newColumn.type === "boolean" || newColumn.type === "enum"
                  ? newConditionOptions[0].value
                  : null,
              min,
              max,
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
export function encodeFiltersToParams(entity, formValues) {
  const { valuesLookup } = columnLookupTableByEntity[entity];

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
    if (condition === "boolean" && value !== valuesLookup[criteria][0]?.value) {
      params.set(`filter.${criteria}`, value);
      return;
    }
    // Enum
    if (
      condition === "enum" &&
      Array.isArray(value) &&
      value.length > 0 &&
      !value.includes(valuesLookup[criteria][0]?.value)
    ) {
      params.set(`filter.${criteria}.in`, value.join(","));
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

export function decodeParamsToQueryInstructions(
  entity,
  searchParams,
  filterNameMapFn = (x) => x,
) {
  const { booleanValuesLookup } = columnLookupTableByEntity[entity];

  const filters = [];

  for (const [key, value] of searchParams.entries()) {
    if (
      !key.startsWith("filter.") ||
      (key === "filter.condition" && value === "boolean")
    )
      continue;

    const parts = key.split(".");
    let criteria = parts[1];

    // Convert nested "__" → "." for Supabase
    const column = filterNameMapFn(criteria.replace(/__/g, "."));

    // Boolean: filter.criteria=true
    if (parts.length === 2) {
      const booleanValue = booleanValuesLookup[value];
      if (booleanValue === null) continue;
      filters.push({
        type: "eq",
        column,
        value: booleanValue,
      });
      continue;
    }

    const operator = parts[2];

    switch (operator) {
      case "eq":
        filters.push({
          type: "eq",
          column,
          value,
        });
        break;

      case "contains":
        filters.push({
          type: "ilike",
          column,
          value: `%${value}%`,
        });
        break;

      case "gt":
        filters.push({
          type: "gt",
          column,
          value: isNaN(value) ? value : Number(value),
        });
        break;

      case "lt":
        filters.push({
          type: "lt",
          column,
          value: isNaN(value) ? value : Number(value),
        });
        break;

      case "range": {
        const [min, max] = value.split("..");
        filters.push({
          type: "gte",
          column,
          value: isNaN(min) ? min : Number(min),
        });
        filters.push({
          type: "lte",
          column,
          value: isNaN(max) ? max : Number(max),
        });
        break;
      }

      case "in":
        filters.push({
          type: "in",
          column,
          value: value.split(","),
        });
        break;

      default:
        throw new Error("Unknown operator: " + operator);
    }
  }

  return filters;
}

export function decodeParamsToFilters(searchParams) {
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

    if (operator === "in") {
      filters.push({
        criteria,
        condition: "enum",
        value: value.split(","),
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

function formatByFilterType(value, filter_type, booleanLookup) {
  if (!value) return null;

  switch (filter_type) {
    case "string":
      return value;
    case "number":
      return Number(value);
    case "date":
      return Date.parse(value);
    case "boolean":
      return booleanLookup ? booleanLookup[value] : Boolean(value);
    case "enum":
      return value;
    default:
      throw Error("Unknown filter type: " + filter_type);
  }
}

function filterRowByCriteria(
  row,
  filter,
  entityLookupTable,
  formatFilterCriteria = (x) => x,
) {
  const { booleanValuesLookup, typesLookup } = entityLookupTable;
  const filter_type = typesLookup[filter.criteria];
  const boolean_lookup = booleanValuesLookup[filter.criteria];
  const raw_row_value = filter.criteria.includes("__")
    ? filter.criteria
        .split("__")
        .map((key) => formatFilterCriteria(key))
        .reduce((acc, curr) => acc?.[curr], row)
    : row[formatFilterCriteria(filter.criteria)];

  const row_value = formatByFilterType(raw_row_value, filter_type);
  const filter_value = formatByFilterType(
    filter.value,
    filter_type,
    boolean_lookup,
  );
  const filter_value_min = formatByFilterType(filter.value_min, filter_type);
  const filter_value_max = formatByFilterType(filter.value_max, filter_type);

  switch (filter.condition) {
    case "contains":
      return row_value.includes(filter_value);
    case "equals":
      return row_value === filter_value;
    case "greater":
      return row_value > filter_value;
    case "less":
      return row_value < filter_value;
    case "range":
      return row_value > filter_value_min && row_value < filter_value_max;
    case "boolean":
      return (filter_value && row_value) || (!filter_value && !row_value);
    case "enum":
      return filter_value.includes(row_value);
    default:
      throw Error("Unknown condition: " + filter.condition);
  }
}

export function applyFilters(entity, array, filters, filterToColumnMapFn) {
  if (!filters || !array?.length) return array;
  const entityLookupTable = columnLookupTableByEntity[entity];
  return array.filter((row) =>
    filters.every((filter) =>
      filterRowByCriteria(row, filter, entityLookupTable, filterToColumnMapFn),
    ),
  );
}
