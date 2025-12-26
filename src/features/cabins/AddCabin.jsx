import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";

export default function AddCabin() {
  return (
    <div>
      <Modal>
        <Modal.Trigger
          target="cabin-form"
          render={(openModal) => (
            <Button onClick={openModal}>Add New Cabin</Button>
          )}
        />
        <Modal.Window
          name="cabin-form"
          render={(closeModal) => <CreateCabinForm onCloseModal={closeModal} />}
        />
      </Modal>
    </div>
  );
}
