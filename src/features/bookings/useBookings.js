import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";

import { useURLParams } from "../../hooks/useURLParams";
import { camelCase } from "../../utils/helpers";
import { decodeParamsToQueryInstructions } from "../../utils/filters";
import { decodeParamsToSort } from "../../utils/sort";

export function useBookings({ defaultOrder }) {
  const { getURLParam, getURLParamAll } = useURLParams();
  const filters = decodeParamsToQueryInstructions(
    "bookings",
    getURLParamAll("filter"),
    camelCase,
  );
  const [colName, direction] = decodeParamsToSort(getURLParam("sort_by"), {
    defaultOrder,
    sortToColumnMapFn: camelCase,
  });

  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings", filters, colName, direction],
    queryFn: () =>
      getBookings({ filters, sortBy: { column: colName, direction } }),
  });
  return { isLoading, error, bookings };
}
