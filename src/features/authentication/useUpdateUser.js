import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUserMetadata as updateCurrentUserMetadataApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  const { isLoading: isUpdating, mutate: updateCurrentUser } = useMutation({
    mutationFn: updateCurrentUserMetadataApi,
    onSuccess: () => {
      toast.success("user data has been updated");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });
  return { isUpdating, updateCurrentUser };
}
