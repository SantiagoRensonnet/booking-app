import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import styled, { css } from "styled-components";

const tabTypes = {
  radio: css`
    &:hover:not(:disabled) {
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    }
  `,
  checkbox: css`
    &:hover:not(:disabled) {
      background-color: var(--color-brand-100);
    }
  `,
};

const StyledTabs = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
  width: fit-content;
  input[type="radio"],
  input[type="checkbox"] {
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
  ${(props) => tabTypes[props.$type || "radio"]}
`;

export default function FormTabs({ controlled = false, ...props }) {
  return controlled ? (
    <ControlledFormTabs {...props} />
  ) : (
    <UncontrolledFormTabs {...props} />
  );
}


function ControlledFormTabs({
  name,
  criteria,
  options,
  controlled,
  checkAllValue,
  type = "radio",
  ...props
}) {
  const { register, watch, setValue } = useFormContext();

  const values = watch(name) || [];  

  function handleChange(value, checked) {
    let next;

    if (value === checkAllValue) {
      next = [checkAllValue];
    } else {
      next = checked
        ? [...values.filter((v) => v !== checkAllValue), value]
        : values.filter((v) => v !== value);

      if (!next.length) next = [checkAllValue];
    }

    setValue(name, next);
  }

  return (
    <StyledTabs {...props}>
      {options.map(({ value, label }, index) => (
        <div key={value || label.toLowerCase()}>
          <input
            type={type}
            {...register(name)}
            value={value}
            id={`${name}_${value}`}
            onClick={(e) => {
              if (type === "checkbox") {
                handleChange(e.target.value, e.target.checked);
              }
            }}
          />
          <StyledTab htmlFor={`${name}_${value}`} type="button" $type={type}>
            {label}
          </StyledTab>
        </div>
      ))}
    </StyledTabs>
  );
}
function UncontrolledFormTabs({
  name,
  options,
  controlled,
  type = "radio",
  ...props
}) {
  return (
    <StyledTabs {...props}>
      {options.map(({ value, label }, index) => (
        <div key={value || label.toLowerCase()}>
          <input
            type={type}
            name={name}
            value={value}
            id={`${name}_${value}`}
            defaultChecked={index === 0}
          />
          <StyledTab htmlFor={`${name}_${value}`} type="button" $type={type}>
            {label}
          </StyledTab>
        </div>
      ))}
    </StyledTabs>
  );
}
