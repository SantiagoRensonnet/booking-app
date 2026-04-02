import { useState } from "react";
import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import useBooking from "../bookings/useBooking";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import useUpdateBooking from "../bookings/useUpdateBooking";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const navigate = useNavigate();
  const moveBack = useMoveBack();

  const { isLoading, data: booking, error } = useBooking();

  const [confirm, setConfirm] = useState(false);

  const { isUpdating, updateBooking } = useUpdateBooking({
    showCustomSuccessMessage: true,
  });

  if (isLoading) return <Spinner />;

  const {
    id: bookingId,
    status,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  function handleCheckin() {
    updateBooking(
      {
        id: bookingId,
        newBookingData: { status: "checked-in", isPaid: true },
      },
      {
        onSuccess: (data) => {
          toast.success(`booking#${data.id} is checked out`);
          navigate("/");
        },
      },
    );
  }

  if (status === "unconfirmed")
    return (
      <>
        <Row type="horizontal">
          <Heading as="h1">Check in booking #{bookingId}</Heading>
          <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
        </Row>

        <BookingDataBox booking={booking} />

        <Box>
          <Checkbox onChange={() => setConfirm((confirm) => !confirm)}>
            I confirm {guests?.fullName} has paid the total amount of $
            {totalPrice}
          </Checkbox>
        </Box>

        <ButtonGroup>
          <Button disabled={!confirm && !isUpdating} onClick={handleCheckin}>
            Check in booking #{bookingId}
          </Button>

          <Button $variation="secondary" onClick={moveBack}>
            Back
          </Button>
        </ButtonGroup>
      </>
    );
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
