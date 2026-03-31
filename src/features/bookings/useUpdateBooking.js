import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking as updateBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export default function useUpdateBooking({ showDefaultSuccessMessage = true }) {
  const queryClient = useQueryClient();
  const { mutate: updateBooking, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, newBookingData }) =>
      updateBookingApi(id, newBookingData),
    onSuccess: (data) => {
      if (showDefaultSuccessMessage)
        toast.success(`booking#${data.id} is updated`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });
  return { isUpdating, updateBooking };
}
