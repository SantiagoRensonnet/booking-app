import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiLogin";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, mutate: login } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (userCredentials) => {
      // we need to make sure "user" cache is updated before re-directing to dashboard (or it could trigger a re-direct to login again)
      queryClient.setQueryData(["user"], userCredentials?.user);
      navigate("/dashboard", { replace: true });
    },
    onError: (e) => {
      console.log("Error:", e.message);
      toast.error("Provided email or password are incorrect");
    },
  });
  return { isLoading, login };
}
