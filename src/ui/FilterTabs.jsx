import styled, { css } from "styled-components";
import { useURLParams } from "../hooks/useUrlParams";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

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

export default function FilterTabs({ filterKey, options }) {
  const { getURLParam, setURLParam } = useURLParams();

  const currentFilterValue =
    getURLParam(filterKey) ??
    options.find((option) => option.value === "").value;

  return (
    <StyledFilter>
      {options.map(({ value, label }) => (
        <FilterButton
          key={value || label.toLowerCase()}
          active={currentFilterValue === value}
          onClick={() => setURLParam(filterKey, value)}
        >
          {label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}
