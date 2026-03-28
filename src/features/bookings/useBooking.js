import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router";

export default function useBooking() {
  const { bookingId } = useParams();

  const { isLoading, data, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId),
  });
  return { isLoading, data, error };
}
