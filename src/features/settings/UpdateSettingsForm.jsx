import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";

import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";
function debounce(cb, delay = 1000) {
  let timer_id;
  return (...args) => {
    clearTimeout(timer_id);
    timer_id = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

function UpdateSettingsForm() {
  const {
    isLoading,
    error,
    settings: {
      breakfastPrice,
      maxBookingLength,
      maxGuestsPerBooking,
      minBookingLength,
    } = {},
  } = useSettings();
  const { isUpdating, updateSetting } = useUpdateSetting();

  function handleInput(e) {
    const column_value = e.target.value;
    if (!column_value) return;

    const column_name = e.target.name;
    const newSetting = {};
    newSetting[column_name] = column_value;
    updateSetting(newSetting);
  }

  if (isLoading) return <Spinner />;
  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          name="minBookingLength"
          defaultValue={minBookingLength}
          type="number"
          id="min-nights"
          disabled={isUpdating}
          onChange={debounce(handleInput)}
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          name="maxBookingLength"
          defaultValue={maxBookingLength}
          type="number"
          id="max-nights"
          disabled={isUpdating}
          onChange={debounce(handleInput)}
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          name="maxGuestsPerBooking"
          defaultValue={maxGuestsPerBooking}
          type="number"
          id="max-guests"
          disabled={isUpdating}
          onChange={debounce(handleInput)}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          name="breakfastPrice"
          defaultValue={breakfastPrice}
          type="number"
          id="breakfast-price"
          disabled={isUpdating}
          onChange={debounce(handleInput)}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
