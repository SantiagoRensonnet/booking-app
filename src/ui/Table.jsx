import { createContext, useContext, useState } from "react";
import styled, { css } from "styled-components";

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  // overflow: hidden;
`;

const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

const StyledTrimmedCell = styled.label`
  input[type="checkbox"] {
    display: none;
  }
  > * {
    cursor: zoom-in;
    word-break: break-word;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 5rem;
    ${(props) => props.$maxWidth && `max-width:${props.$maxWidth}`}
  }
  ${(props) =>
    props.$expand &&
    css`
      > * {
        white-space: unset;
        cursor: zoom-out;
      }
    `}
`;

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;
const TableContext = createContext();

function Table({ columns, children }) {
  const [expandedRows, setExpandedRows] = useState({});
  return (
    <TableContext value={{ columns, expandedRows, setExpandedRows }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext>
  );
}
function Header({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledHeader as="header" role="row" $columns={columns}>
      {children}
    </StyledHeader>
  );
}

function Body({ data, render }) {
  if (!data?.length) return <Empty>No data</Empty>;
  return <StyledBody>{data.map((el) => render(el))}</StyledBody>;
}
function Row({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledRow role="row" $columns={columns}>
      {children}
    </StyledRow>
  );
}

function TrimmedCell({ rowId, trimmingEnable, maxWidth, children }) {
  const { expandedRows, setExpandedRows } = useContext(TableContext);
  function handleChange() {
    setExpandedRows((state) => ({
      ...state,
      [rowId]: state[rowId] ? false : true,
    }));
  }
  return trimmingEnable ? (
    <StyledTrimmedCell
      $expand={expandedRows[rowId]}
      $maxWidth={maxWidth}
      onChange={handleChange}
    >
      <input type="checkbox" />
      {children}
    </StyledTrimmedCell>
  ) : (
    <>{children}</>
  );
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;
Table.TrimmedCell = TrimmedCell;

export default Table;
