import { columnsByEntity, columnLookupTableByEntity } from "../../utils/tables";
import { decodeParamsToFilters } from "../../utils/filters";

import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";
import FilterWindow from "../../ui/FilterWindow";

import { useURLParams } from "../../hooks/useURLParams";

function BookingTableOperations() {
  const { getURLParamAll } = useURLParams();
  const filters = decodeParamsToFilters(getURLParamAll("filter"));
  return (
    <TableOperations>
      <SortBy
        options={[
          { value: "start_date.desc", label: "Sort by date (recent first)" },
          { value: "start_date.asc", label: "Sort by date (earlier first)" },
          {
            value: "total_price.desc",
            label: "Sort by amount (high first)",
          },
          { value: "total_price.asc", label: "Sort by amount (low first)" },
        ]}
      />
      <FilterWindow
        entityName="bookings"
        columns={columnsByEntity.bookings}
        lookupTables={columnLookupTableByEntity.bookings}
        initialFilters={filters}
        layout={{
          columns: "14rem 14rem 1fr 3em",
          maxWidth: { input: "14.2em" },
        }}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
