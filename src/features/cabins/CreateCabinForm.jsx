import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useUpdateCabin } from "./useUpdateCabin";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;

  const isEditSession = Boolean(editId);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({ defaultValues: isEditSession ? editValues : {} });

  const { isUpdating, updateCabin } = useUpdateCabin();

  function onSubmit(data) {
    updateCabin(
      { newCabinData: data, id: editId },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }
  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          {...register("name", { required: "This field is required" })}
          type="text"
          id="name"
          aria-invalid={errors.name ? "true" : "false"}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          {...register("maxCapacity", {
            required: "This field is required",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
          type="number"
          id="maxCapacity"
          aria-invalid={errors.maxCapacity ? "true" : "false"}
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          {...register("regularPrice", {
            required: "This field is required",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
          type="number"
          id="regularPrice"
          aria-invalid={errors.regularPrice ? "true" : "false"}
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              Number(value) < Number(getValues().regularPrice) ||
              "Discount should be less than regular price",
          })}
          type="number"
          id="discount"
          defaultValue={0}
          aria-invalid={errors.discount ? "true" : "false"}
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          {...register("description")}
          id="description"
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
          id="image"
          accept="image/*"
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          onClick={() => onCloseModal?.()}
          $variation="secondary"
          type="reset"
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>
          {isEditSession ? "Edit cabin" : "Create cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
