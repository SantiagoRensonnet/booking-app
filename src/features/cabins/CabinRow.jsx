import styled from "styled-components";
import { HiSquare2Stack, HiPencil, HiTrash } from "react-icons/hi2";

import { formatCurrency } from "../../utils/helpers";
import { useDeleteCabin } from "./useDeleteCabin";
import { useUpdateCabin } from "./useUpdateCabin";

import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";
import Table from "../../ui/Table";
import ConfirmDelete from "../../ui/ConfirmDelete";
import MenusController from "../../ui/MenusController";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

const ButtonArray = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export default function CabinRow({ cabin }) {
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { isUpdating, updateCabin } = useUpdateCabin();

  function handleDuplicate() {
    const { id, ...newCabinData } = cabin;
    newCabinData.name = `Copy of ${newCabinData.name}`;
    updateCabin({ newCabinData });
  }
  return (
    <>
      <Table.Row role="row">
        {cabin.image ? <Img src={cabin.image} /> : <div></div>}
        <Cabin>{cabin.name}</Cabin>
        <div>Fits up to {cabin.maxCapacity} guests</div>
        <Price>{formatCurrency(cabin.regularPrice)}</Price>
        {cabin.discount ? (
          <Discount>{formatCurrency(cabin.discount)}</Discount>
        ) : (
          <span>&mdash;</span>
        )}
        <Modal>
          <Modal.Window
            name="edit-cabin"
            render={(closeModal) => (
              <CreateCabinForm cabinToEdit={cabin} onCloseModal={closeModal} />
            )}
          />
          <Modal.Window
            name="delete-cabin"
            render={(closeModal) => (
              <ConfirmDelete
                resourceName={`cabin ${cabin.name}`}
                onConfirm={() => deleteCabin(cabin.id)}
                onCancel={closeModal}
                disabled={isDeleting}
              />
            )}
          />
          <MenusController.Menu>
            <MenusController.Toggle id={cabin.id} />
            <MenusController.List id={cabin.id}>
              <MenusController.Button
                title="duplicate"
                disabled={isUpdating}
                onClick={handleDuplicate}
                icon={<HiSquare2Stack />}
                closeOnClick={true}
              >
                Duplicate
              </MenusController.Button>
              <Modal.Trigger
                target="edit-cabin"
                render={(openModal) => (
                  <MenusController.Button
                    title="edit"
                    onClick={openModal}
                    icon={<HiPencil />}
                    closeOnClick={true}
                  >
                    Edit
                  </MenusController.Button>
                )}
              />
              <Modal.Trigger
                target="delete-cabin"
                render={(openModal) => (
                  <MenusController.Button
                    title="delete"
                    onClick={openModal}
                    icon={<HiTrash />}
                    closeOnClick={true}
                  >
                    Delete
                  </MenusController.Button>
                )}
              />
            </MenusController.List>
          </MenusController.Menu>
        </Modal>
      </Table.Row>
    </>
  );
}
