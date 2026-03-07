import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import MenusController from "../../ui/MenusController";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";

import { useBookings } from "./useBookings";
import { applyFilters, decodeParamsToFilters } from "../../utils/filters";
import { useURLParams } from "../../hooks/useUrlParams";
import { decodeParamsToSort, sortByColumn } from "../../utils/sort";
import { camelCase } from "../../utils/helpers";

function BookingTable() {
  const { getURLParam, getURLParamAll } = useURLParams();

  const currentFilters = decodeParamsToFilters(getURLParamAll("filter"));
    const [colName, direction] = decodeParamsToSort(getURLParam("sort_by"), {
    defaultOrder: "start_date.desc",
    paramsMappingFn: camelCase,
  });

  const { isLoading, error, bookings } = useBookings({
    defaultOrder: { column: colName, direction },
  });

  if (isLoading) return <Spinner />;

  if (!bookings.length) return <Empty resourceName="bookings" />;  

  const filteredBookings = applyFilters("bookings", bookings, currentFilters);
  const sortedBookings = sortByColumn(filteredBookings, colName, direction);

  return (
    <MenusController>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedBookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
      </Table>
    </MenusController>
  );
}

export default BookingTable;
