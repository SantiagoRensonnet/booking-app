import TableOperations from "../../ui/TableOperations";
import SortBy from "../../ui/SortBy";
import  FilterWindow  from "../../ui/FilterWindow";
export default function CabinTableOperations() {
  return (
    <TableOperations>
      <SortBy
        options={[
          { value: "name.asc", label: "Sort by name (A-Z)" },
          { value: "name.desc", label: "Sort by name (Z-A)" },
          { value: "regular_price.asc", label: "Sort by price (low first)" },
          { value: "regular_price.desc", label: "Sort by price (high first)" },
          { value: "max_capacity.asc", label: "Sort by capacity (low first)" },
          {
            value: "max_capacity.desc",
            label: "Sort by capacity (high first)",
          },
        ]}
      />
      <FilterWindow
        columns={[
          { name: "name", label: "Name", type: "string" },
          { name: "regular_price", label: "Price", type: "number", min: 0 },
          { name: "max_capacity", label: "Capacity", type: "number", min: 0 },
          {
            name: "discount",
            label: "Discount",
            type: "boolean",
            values: [
              { value: "", label: "All" },
              { value: "true", label: "With discount" },
              { value: "false", label: "No discount" },
            ],
          },
        ]}
        defaultValue={{
          type: "string",
          criteria: "name",
          label: "Name",
          condition: "contains",
        }}
      />
    </TableOperations>
  );
}
