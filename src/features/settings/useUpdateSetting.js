import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";
import toast from "react-hot-toast";

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  const { isLoading: isUpdating, mutate: updateSetting } = useMutation({
    mutationFn: (newSetting) => {            
      return updateSettingApi(newSetting);
    },
    onSuccess: (data, variables, context) => {
      toast.success("New setting updated");
      //this makes query state "invalid" and re fetches cabins
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });
  return { isUpdating, updateSetting };
}
