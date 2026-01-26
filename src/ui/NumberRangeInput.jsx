import { useFormContext } from "react-hook-form";

import Input from "./Input";
import styled from "styled-components";

const StyledNumberRangeInput = styled.div`
  display: flex;
  gap: 0.5em;
  align-items: center;
`;

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
}) {
  const {
    register,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
  } = useFormContext();
  function isRangeValid(min, max) {
    if (!min || !max) return;      
    if (max > min) clearErrors(`${name}_range`);
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
        type="number"
        onInput={(e) =>
          isRangeValid(Number(e.target.value), getValues(`${name}_max`))
        }
        aria-invalid={errors[`${name}_min`] ? "true" : "false"}
        {...register(`${name}_min`, {
          required: "Min value is required",
          min: {
            value: min,
            message: `Minimum ${filterLabel.toLowerCase()} should be at least ${min}`,
          }
        })}
      />
      {separator && <span>{separator}</span>}
      <Input
        $width="100%"
        type="number"
        aria-invalid={errors[`${name}_max`] ? "true" : "false"}
        onInput={(e) =>
          isRangeValid(getValues(`${name}_min`), Number(e.target.value))
        }
        {...register(`${name}_max`, {
          required: "Max value is required",
          max: {
            value: max,
            message: `Maximum ${filterLabel.toLowerCase()} should be less than ${max}`,
          }
        })}
      />
    </StyledNumberRangeInput>
  );
}
function UncontrolledNumberRangeInput({ separator, name, min, max }) {
  return (
    <StyledNumberRangeInput>
      <Input name={`${name}_min`} $width="100%" type="number" min={min} />
      {separator && <span>{separator}</span>}
      <Input name={`${name}_max`} $width="100%" type="number" max={max} />
    </StyledNumberRangeInput>
  );
}
