import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";


import Button from "./Button";
import Modal from "./Modal";
import FilterForm  from "./FilterForm/FilterForm";


export default function FilterWindow({ columns, initialFilters, layout }) {
  return (
    <Modal>
      <Modal.Trigger
        target="filter-window"
        render={(openModal) => (
          <Button
            $variation="secondary"
            $alignCenter="true"
            $number={initialFilters.length}
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
            layout={layout}
            initialFilters={initialFilters}
            closeModal={closeModal}
          />
        )}
      />
    </Modal>
  );
}
