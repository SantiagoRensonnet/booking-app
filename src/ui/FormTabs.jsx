import { useFormContext } from "react-hook-form";
import styled, { css } from "styled-components";

const StyledTabs = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
  width: fit-content;
  input[type="radio"] {
    display: none;
    &:checked {
      + label {
        background-color: var(--color-brand-600);
        color: var(--color-brand-50);
      }
    }
  }
  ${(props) =>
    props.$column &&
    css`
      grid-column: ${props.$column};
    `}
`;

const StyledTab = styled.label`
  display: inline-block;

  background-color: var(--color-grey-0);
  border: none;
  cursor: pointer;

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

export default function FormTabs({ controlled = false, ...props }) {
  return controlled ? (
    <ControlledFormTabs {...props} />
  ) : (
    <UncontrolledFormTabs {...props} />
  );
}

function ControlledFormTabs({ name, options, controlled, ...props }) {
  const { register } = useFormContext();
  return (
    <StyledTabs {...props}>
      {options.map(({ value, label }, index) => (
        <div key={value || label.toLowerCase()}>
          <input
            type="radio"
            {...register(name)}
            value={value}
            id={`${name}_${value}`}
            defaultChecked={index === 0}
          />
          <StyledTab htmlFor={`${name}_${value}`} type="button">
            {label}
          </StyledTab>
        </div>
      ))}
    </StyledTabs>
  );
}
function UncontrolledFormTabs({ name, options, controlled, ...props }) {
  return (
    <StyledTabs {...props}>
      {options.map(({ value, label }, index) => (
        <div key={value || label.toLowerCase()}>
          <input
            type="radio"
            name={name}
            value={value}
            id={`${name}_${value}`}
            defaultChecked={index === 0}
          />
          <StyledTab htmlFor={`${name}_${value}`} type="button">
            {label}
          </StyledTab>
        </div>
      ))}
    </StyledTabs>
  );
}
