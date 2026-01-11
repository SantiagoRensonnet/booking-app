import styled, { css } from "styled-components";

const Input = styled.input`
  border: 1px solid #ddd;
  padding: 0.5em 1em;
  border-radius: 5px;
  ${(props) =>
    props.$width &&
    css`
      width: ${props.$width};
    `}
`;

export default Input;
