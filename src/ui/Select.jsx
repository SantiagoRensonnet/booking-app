import { useFormContext } from "react-hook-form";

import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

export default function Select({ controlled = false, ...props }) {
  return controlled ? (
    <ControlledSelect key={1} {...props} />
  ) : (
    <UncontrolledSelect key={2} {...props} />
  );
}

function UncontrolledSelect({ name, options, value, onChange }) {
  return (
    <StyledSelect name={name} defaultValue={value} onChange={onChange}>
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}
function ControlledSelect({ name, options, value, onChange, validate }) {
  const { register } = useFormContext();
  return (
    <StyledSelect
      {...register(name, { validate })}
      defaultValue={value}
      onChange={onChange}
    >
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}
