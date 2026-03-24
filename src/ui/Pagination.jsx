import styled from "styled-components";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useURLParams } from "../hooks/useURLParams";
import { getPaginationInfo, PAGE_SIZE } from "../utils/pagination";

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
  color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

export default function Pagination({ count }) {
  const { getURLParam, setURLParam } = useURLParams();
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (pageCount <= 1) return null;

  const page = Number(getURLParam("page")) || 1;

  const { from, to } = getPaginationInfo({ page, count });

  function previousPage() {
    if (page === 1) return;
    setURLParam("page", page - 1);
  }
  function nextPage() {
    if (page >= pageCount) return;
    setURLParam("page", page + 1);
  }
  return (
    <StyledPagination>
      <P>
        Showing <span>{from}</span> to <span>{to}</span> of <span>{count}</span>{" "}
        results
      </P>
      <Buttons>
        <PaginationButton disabled={page === 1} onClick={previousPage}>
          <HiChevronLeft /> <span>Previous</span>
        </PaginationButton>
        <PaginationButton disabled={page === pageCount} onClick={nextPage}>
          <span>Next</span> <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}
