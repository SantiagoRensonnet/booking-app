export const columnsByEntity = {
  cabins: [
    { name: "name", label: "Name", type: "string" },
    { name: "regular_price", label: "Price", type: "number", min: 0 },
    { name: "max_capacity", label: "Capacity", type: "number", min: 0 },
    {
      name: "discount",
      label: "Discount",
      type: "boolean",
      values: [
        { value: "all", label: "All" },
        { value: "with-discount", label: "With discount" },
        { value: "without-discount", label: "No discount" },
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
  columns.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.type }), {});

export const columnTypeLookupTableByEntity = Object.entries(
  columnsByEntity,
).reduce(
  (acc, curr) => ({ ...acc, [curr[0]]: createColumnTypeLookupTable(curr[1]) }),
  {},
);
