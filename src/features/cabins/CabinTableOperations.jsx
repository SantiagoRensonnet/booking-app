import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
export default function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterKey="discount"
        options={[
          { value: "", label: "All" },
          { value: "with-discount", label: "With discount" },
          { value: "no-discount", label: "No discount" },
        ]}
      />
      <SortBy
        options={[
          { value: "name.asc", label: "Sort by name (A-Z)" },
          { value: "name.desc", label: "Sort by name (Z-A)" },
          { value: "regular_price.asc", label: "Sort by price (low first)" },
          { value: "regular_price.desc", label: "Sort by price (high first)" },
          { value: "max_capacity.asc", label: "Sort by capacity (low first)" },
          { value: "max_capacity.desc", label: "Sort by capacity (high first)" },
        ]}
      />
    </TableOperations>
  );
}
