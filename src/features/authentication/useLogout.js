import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { logout as logoutApi } from "../../services/apiLogout";
import toast from "react-hot-toast";

export default function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, mutate: logout } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // we clean cache for security reasons -> user is not longer logged in, data shouldn't be available
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  return { isLoading, logout };
}
