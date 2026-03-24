import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";

import { useURLParams } from "../../hooks/useURLParams";
import { camelCase } from "../../utils/helpers";
import { decodeParamsToQueryInstructions } from "../../utils/filters";
import { decodeParamsToSort } from "../../utils/sort";
import { PAGE_SIZE } from "../../utils/pagination";

export function useBookings({ defaultOrder }) {
  const queryClient = useQueryClient();

  const { getURLParam, getURLParamAll } = useURLParams();
  // FILTER
  const filters = decodeParamsToQueryInstructions(
    "bookings",
    getURLParamAll("filter"),
    camelCase,
  );
  // SORT
  const [colName, direction] = decodeParamsToSort(getURLParam("sort_by"), {
    defaultOrder,
    sortToColumnMapFn: camelCase,
  });

  // PAGINATION
  const page = Number(getURLParam("page")) || 1;

  const { isLoading, data, error } = useQuery({
    queryKey: ["bookings", filters, colName, direction, page],
    queryFn: () =>
      getBookings({ filters, sortBy: { column: colName, direction }, page }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(data?.count / PAGE_SIZE);
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filters, colName, direction, page + 1],
      queryFn: () =>
        getBookings({
          filters,
          sortBy: { column: colName, direction },
          page: page + 1,
        }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filters, colName, direction, page - 1],
      queryFn: () =>
        getBookings({
          filters,
          sortBy: { column: colName, direction },
          page: page - 1,
        }),
    });

  return { isLoading, error, data: data?.data, count: data?.count };
}
