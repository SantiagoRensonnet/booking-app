import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCabin as updateCabinApi } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useUpdateCabin(closeForm = null) {
  const queryClient = useQueryClient();
  const { isLoading: isUpdating, mutate: updateCabin } = useMutation({
    mutationFn: ({newCabinData, id}) => {            
      return updateCabinApi(newCabinData, id);
    },
    onSuccess: (data, variables, context) => {
      if (variables?.name)
        toast.success(`${variables.name} cabin successfully updated`);
      else toast.success("New cabin successfully created");
      if (closeForm) closeForm();
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
  return { isUpdating, updateCabin };
}
