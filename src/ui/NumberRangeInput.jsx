import { useFormContext } from "react-hook-form";

import Input from "./Input";
import styled from "styled-components";

const StyledNumberRangeInput = styled.div`
  display: flex;
  gap: 0.5em;
  align-items: center;
`;

function formatByType(val, type) {
  switch (type) {
    case "date":
      return Date.parse(val);
    case "number":
      return Number(val);
    default:
      throw new Error("Unknown type: " + type);
  }
}

export default function NumberRangeInput({ controlled = false, ...props }) {
  return controlled ? (
    <ControlledNumberRangeInput {...props} />
  ) : (
    <UncontrolledNumberRangeInput {...props} />
  );
}

function ControlledNumberRangeInput({
  separator,
  name,
  filterLabel,
  min,
  max,
  defaultMin,
  defaultMax,
  type = "number",
  maxWidth
}) {
  const {
    register,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
  } = useFormContext();
  function isRangeValid(min, max, type) {
    if (!min || !max) return;
    if (formatByType(max, type) > formatByType(min, type))
      clearErrors(`${name}_range`);
    else
      setError(`${name}_range`, {
        type: "custom",
        message: "Max should be greater than min",
      });
  }
  return (
    <StyledNumberRangeInput>
      <Input
        $width="100%"
        $maxWidth={maxWidth}
        type={type}
        onInput={(e) =>
          isRangeValid(e.target.value, getValues(`${name}_max`), type)
        }
        aria-invalid={errors[`${name}_min`] ? "true" : "false"}
        {...register(`${name}_min`, {
          required: "Min value is required",
          min: {
            value: min,
            message:
              type === "date"
                ? `Only dates before ${min} are accepted`
                : `Minimum ${filterLabel.toLowerCase()} should be at least ${min}`,
          },
        })}
        defaultValue={defaultMin}
      />
      {separator && <span>{separator}</span>}
      <Input
        $width="100%"
        $maxWidth={maxWidth}
        type={type}
        aria-invalid={errors[`${name}_max`] ? "true" : "false"}
        onInput={(e) => isRangeValid(getValues(`${name}_min`), e.target.value)}
        {...register(`${name}_max`, {
          required: "Max value is required",
          max: {
            value: max,
            message:
              type === "date"
                ? `Only dates after ${max} are accepted`
                : `Maximum ${filterLabel.toLowerCase()} should be less than ${max}`,
          },
        })}
        defaultValue={defaultMax}
      />
    </StyledNumberRangeInput>
  );
}
function UncontrolledNumberRangeInput({
  separator,
  name,
  min,
  max,
  defaultMin,
  defaultMax,
  type = "number",
  maxWidth
}) {
  return (
    <StyledNumberRangeInput>
      <Input
        name={`${name}_min`}
        $width="100%"
        $maxWidth={maxWidth}
        type={type}
        min={min}
        defaultValue={defaultMin}
      />
      {separator && <span>{separator}</span>}
      <Input
        name={`${name}_max`}
        $width="100%"
        $maxWidth={maxWidth}
        type={type}
        max={max}
        defaultValue={defaultMax}
      />
    </StyledNumberRangeInput>
  );
}
