import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
export default function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterKey="discount"
        filterValues={[
          { value: "", label: "All" },
          { value: "with-discount", label: "With discount" },
          { value: "no-discount", label: "No discount" },
        ]}
      />
    </TableOperations>
  );
}
