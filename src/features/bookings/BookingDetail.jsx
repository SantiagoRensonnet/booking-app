import { useNavigate } from "react-router";
import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import useBooking from "./useBooking";
import useUpdateBooking from "./useUpdateBooking";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { HiTrash } from "react-icons/hi2";
import { useDeleteBooking } from "./useDeleteBooking";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  const { isLoading, data: booking, error } = useBooking();
  const { isLoading: isUpdating, updateBooking } = useUpdateBooking();
  const { isLoading: isDeleting, deleteBooking } = useDeleteBooking();

  if (isLoading) return <Spinner />;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  const status = booking.status;

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{booking.id}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        <Modal>
          <Modal.Window
            name="delete-booking"
            render={(closeModal) => (
              <ConfirmDelete
                resourceName="booking"
                onConfirm={() => {
                  deleteBooking(booking.id);
                  navigate("/");
                }}
                onCancel={closeModal}
              />
            )}
          />
          <Modal.Trigger
            target="delete-booking"
            render={(openModal) => (
              <Button
                $variation="danger"
                disabled={isDeleting}
                title="edit"
                onClick={openModal}
                icon={<HiTrash />}
                closeOnClick={true}
              >
                Delete booking
              </Button>
            )}
          />
        </Modal>
        {booking.status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${booking.id}`)}>
            Check in
          </Button>
        )}
        {booking.status === "checked-in" && (
          <Button
            disabled={isUpdating}
            onClick={() =>
              updateBooking(
                {
                  id: booking.id,
                  newBookingData: { status: "checked-out" },
                },
                {
                  onSuccess: () => navigate("/"),
                },
              )
            }
          >
            Check out
          </Button>
        )}
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
