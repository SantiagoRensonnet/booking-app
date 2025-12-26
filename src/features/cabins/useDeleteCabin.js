import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";
export function useDeleteCabin() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate:deleteCabin } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      //this makes query state "invalid" and re fetches cabins
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });
  return { isDeleting, deleteCabin };
}
