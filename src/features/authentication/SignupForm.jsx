import { useForm } from "react-hook-form";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import SpinnerMini from "../../ui/SpinnerMini";
import useSignUp from "./useSignUp";

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({ defaultValues: {} });
  const { isLoading, signUp } = useSignUp();

  function onSubmit({ email, password, fullName }) {
    signUp(
      {
        email,
        password,
        fullName,
      },
      { onSettled: () => reset() },
    );
  }
  function onError(errors) {
    console.log(errors);
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input {...register("fullName")} id="fullName" />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
          id="email"
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password need to have at least 8 characters",
            },
          })}
          type="password"
          id="password"
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          {...register("passwordConfirm", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password need to have at least 8 characters",
            },
            validate: (value) =>
              value === getValues("password") || "Passwords need to match",
          })}
          type="password"
          id="passwordConfirm"
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button $variation="secondary" type="reset">
          Cancel
        </Button>
        <Button>{isLoading ? <SpinnerMini /> : "Create new user"}</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
