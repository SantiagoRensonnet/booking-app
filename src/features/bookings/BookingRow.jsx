import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import MenusController from "../../ui/MenusController";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import { HiArrowDownOnSquare, HiArrowUpOnSquare, HiEye } from "react-icons/hi2";
import { NavLink, useNavigate } from "react-router";
import useUpdateBooking from "./useUpdateBooking";
import toast from "react-hot-toast";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function BookingRow({
  booking: {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
}) {
  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };
  const navigate = useNavigate();
  const { isUpdating, updateBooking } = useUpdateBooking({
    showDefaultSuccessMessage: false,
  });

  return (
    <Table.Row>
      <Table.TrimmedCell
        rowId={bookingId}
        maxWidth="7rem"
        trimmingEnable={cabinName.length > 4}
      >
        <Cabin>{cabinName}</Cabin>
      </Table.TrimmedCell>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>
      <MenusController.Menu>
        <MenusController.Toggle id={bookingId} />
        <MenusController.List id={bookingId}>
          <MenusController.Button
            onClick={() => navigate(`/bookings/${bookingId}`)}
            title="details"
            icon={<HiEye />}
          >
            See details
          </MenusController.Button>
          {status === "unconfirmed" && (
            <MenusController.Button
              onClick={() => navigate(`/checkin/${bookingId}`)}
              title="check-in"
              icon={<HiArrowDownOnSquare />}
              disabled={isUpdating}
            >
              Check in
            </MenusController.Button>
          )}
          {status === "checked-in" && (
            <MenusController.Button
              onClick={() =>
                updateBooking(
                  {
                    id: bookingId,
                    newBookingData: { status: "checked-out" },
                  },
                  {
                    onSuccess: (data) =>
                      toast.success(`booking#${data.id} is checked out`),
                  },
                )
              }
              title="check-out"
              icon={<HiArrowUpOnSquare />}
            >
              Check out
            </MenusController.Button>
          )}
        </MenusController.List>
      </MenusController.Menu>
    </Table.Row>
  );
}

export default BookingRow;
