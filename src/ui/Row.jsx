import styled, { css } from "styled-components";

const defaultValue = "vertical";
const Row = styled.div`
  display: flex;
  ${(props) =>
    (props.type ?? defaultValue) === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
    `}
  ${(props) =>
    (props.type ?? defaultValue) === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;

Row.defaultProps = { type: "vertical" };

export default Row;
