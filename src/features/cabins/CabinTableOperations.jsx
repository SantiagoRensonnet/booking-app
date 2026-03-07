import { decodeParamsToFilters } from "../../utils/filters";
import { columnsByEntity } from "../../utils/tables";

import TableOperations from "../../ui/TableOperations";
import SortBy from "../../ui/SortBy";
import FilterWindow from "../../ui/FilterWindow";

import { useURLParams } from "../../hooks/useURLParams";

export default function CabinTableOperations() {
  const { getURLParamAll } = useURLParams();
  const filters = decodeParamsToFilters(getURLParamAll("filter"));
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
      <FilterWindow columns={columnsByEntity.cabins} initialFilters={filters} />
    </TableOperations>
  );
}
