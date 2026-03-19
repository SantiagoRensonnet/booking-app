const columnsByEntity = {
  cabins: [
    { name: "name", label: "Name", type: "string" },
    { name: "regular_price", label: "Price", type: "number", min: 0 },
    { name: "max_capacity", label: "Capacity", type: "number", min: 0 },
    {
      name: "discount",
      label: "Discount",
      type: "boolean",
      values: [
        { value: "all", booleanValue: null, label: "All" },
        { value: "with-discount", booleanValue: true, label: "With discount" },
        {
          value: "without-discount",
          booleanValue: false,
          label: "No discount",
        },
      ],
    },
  ],
  bookings: [
    {
      name: "cabins__name",
      label: "Cabin name",
      type: "string",
    },
    {
      name: "guests__email",
      label: "Guest email",
      type: "string",
    },
    {
      name: "start_date",
      label: "Start date",
      type: "date",
    },
    {
      name: "end_date",
      label: "End date",
      type: "date",
    },
    {
      name: "total_price",
      label: "Amount",
      type: "number",
    },
    {
      name: "status",
      label: "Status",
      type: "enum",
      values: [
        { value: "all", label: "All" },
        { value: "checked-out", label: "Checked out" },
        { value: "checked-in", label: "Checked in" },
        { value: "unconfirmed", label: "Unconfirmed" },
      ],
    },
  ],
};

const createColumnTypeLookupTable = (columns) =>
  columns.reduce(
    (acc, curr) => ({ ...acc, [curr.name]: curr.type ?? null }),
    {},
  );
const createColumnLabelsLookupTable = (columns) =>
  columns.reduce(
    (acc, curr) => ({ ...acc, [curr.name]: curr.label ?? null }),
    {},
  );
const createColumnValuesLookupTable = (columns) =>
  columns.reduce(
    (acc, curr) => ({ ...acc, [curr.name]: curr.values ?? null }),
    {},
  );
const createColumnNumConstraintsLookupTable = (columns) =>
  columns.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.name]: {
        min: curr.min ?? null,
        max: curr.max ?? null,
      },
    }),
    {},
  );
const createColumnBooleanValuesLookupTable = (columns) =>
  columns.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.name]:
        curr.values?.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.value]: curr?.booleanValue ?? null,
          }),
          {},
        ) ?? null,
    }),
    {},
  );

const columnLookupTableByEntity = Object.entries(columnsByEntity).reduce(
  (acc, curr) => ({
    ...acc,
    [curr[0]]: {
      typesLookup: createColumnTypeLookupTable(curr[1]),
      labelsLookup: createColumnLabelsLookupTable(curr[1]),
      valuesLookup: createColumnValuesLookupTable(curr[1]),
      booleanValuesLookup: createColumnBooleanValuesLookupTable(curr[1]),
      numConstraintsLookup: createColumnNumConstraintsLookupTable(curr[1]),
    },
  }),
  {},
);

console.log(columnLookupTableByEntity);

export { columnsByEntity, columnLookupTableByEntity };
