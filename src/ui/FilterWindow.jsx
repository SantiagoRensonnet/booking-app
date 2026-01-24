import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";


import Button from "./Button";
import Modal from "./Modal";
import FilterForm  from "./FilterForm";


export default function FilterWindow({ columns, defaultValue }) {
  return (
    <Modal>
      <Modal.Trigger
        target="filter-window"
        render={(openModal) => (
          <Button
            $variation="secondary"
            $alignCenter="true"
            onClick={openModal}
          >
            <HiMiniAdjustmentsHorizontal /> Filter
          </Button>
        )}
      />
      <Modal.Window
        name="filter-window"
        render={(closeModal) => (
          <FilterForm
            columns={columns}
            defaultValue={defaultValue}
            closeModal={closeModal}
          />
        )}
      />
    </Modal>
  );
}
