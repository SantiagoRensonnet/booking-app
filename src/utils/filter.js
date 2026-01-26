// Filter form utils

export function getConditionsByColumnType(column) {
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

export function reducer(state, action) {
  switch (action.type) {
    case "added_filter": {
      const unused_columns = state.columns.filter(
        (column) => !action.usedCriteriaArray.includes(column.name),
      );
      if (!unused_columns.length) return state;

      const nextFilter = unused_columns[0];
      const newType = nextFilter.type;
      const newConditionOptions = getConditionsByColumnType(nextFilter);
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
            criteriaOptions: state.columns.map((column) => ({
              label: column.label,
              value: column.name,
            })),
            condition: newConditionOptions[0].value,
            conditionOptions: newConditionOptions,
            ...(min !== undefined && { min }),
            ...(max !== undefined && { max }),
          },
        ],
      };
    }
    case "deleted_filter": {
      return {
        ...state,
        filters: state.filters.filter((filter) => filter.id !== action.id),
      };
    }
    case "criteria_changed": {
      const newColumn = state.columns.find(
        (column) => column.name === action.newCriteria,
      );
      const newConditionOptions = getConditionsByColumnType(newColumn);
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
              condition: newConditionOptions[0].value,
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
  booleans = [true, false]
) {
  if (!value) return array;
  if (!booleans.find((bool) => value === bool)) return [];
  return array.filter((el) => (value === booleans[0] ? el[key] : !el[key]));
}
