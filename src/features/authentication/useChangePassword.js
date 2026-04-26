import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword as changePasswordApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useChangePassword() {
  const queryClient = useQueryClient();
  const { isLoading: isUpdating, mutate: changePassword } = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      toast.success("password has been updated");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });
  return { isLoading: isUpdating, changePassword };
}
