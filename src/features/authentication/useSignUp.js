import { useMutation } from "@tanstack/react-query";
import { signUp as signUpApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useSignUp() {
  const { isLoading, mutate: signUp } = useMutation({
    mutationFn: ({ email, password, fullName }) => signUpApi({ email, password, fullName }),
    onSuccess: (user) => {
      toast.success(
        "Account successfully created! Please verify the new account from the user's email address.",
      );
    },
    onError: (e) => {
      console.log(e)
      toast.error(e.message);
    },
  });
  return { isLoading, signUp };
}
