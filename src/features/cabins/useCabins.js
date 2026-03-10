import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins({ defaultOrder }) {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: () => getCabins(defaultOrder),
  });
  return { isLoading, error, cabins };
}
