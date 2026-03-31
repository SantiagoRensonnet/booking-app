import styled, { css } from "styled-components";

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};

const Button = styled.button`
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem;
  background-color: var(--color-indigo-100);
  color: white;
  cursor: pointer;
  border: none;
  padding: 0.5em;
  border-radius: var(--border-radius-sm);
  &:hover {
    background: var(--color-green-700);
  }
  &[disabled]{
    cursor:not-allowed;
    opacity:0.5;
  }
  ${(props) => sizes[props.$size ?? "medium"]}
  ${(props) => variations[props.$variation ?? "primary"]}
  ${(props) =>
    props.$alignCenter &&
    css`
      display: flex;
      align-items: center;
      gap: 0.25em;
    `}
  ${(props) =>
    props.$number &&
    css`
      border-color: var(--color-grey-700);
      border-width: 1.5px;
      position: relative;
      &:before {
        content: "${props.$number}";
        position: absolute;
        top: -0.75rem;
        right: -0.75rem;
        font-size:1rem;
        font-weight:bold;
        width:3ch;
        aspect-ratio:1/1;
        background-color: var(--color-grey-700);
        border:2px solid var(--color-grey-0);
        color: var(--color-grey-0);
        border-radius:50%;
        display:flex;
        justify-content:center;
        align-items:center;
      }
    `}
`;

export default Button;
