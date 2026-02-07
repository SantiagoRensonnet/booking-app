import styled, { css } from "styled-components";
import { useState, useEffect } from "react";

const StyledListViewport = styled.div`
  ${(props) =>
    props.$maxHeight &&
    css`
      max-height: ${props.$maxHeight};
    `};
    overflow-y: auto;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    padding: 1px;
    ${(props) =>
    props.$paddingRight &&
    css`
      padding-right: ${props.$paddingRight};
    `},
`;

export default function ListViewport({
  lastChildRef,
  childrenLength,
  childrenMax,
  children,
}) {
  const [maxHeight, setMaxHeight] = useState(null);
  useEffect(() => {
    if (lastChildRef?.current) {
      if (!maxHeight)
        setMaxHeight(
          `${Math.ceil(
            16 + lastChildRef.current.offsetHeight * (childrenMax + 1)
          )}px`
        );
      if (childrenLength > childrenMax)
        lastChildRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lastChildRef, childrenLength, childrenMax, maxHeight]);

  return (
    <StyledListViewport
      $paddingRight={childrenLength > childrenMax ? "1em" : "1px"}
      $maxHeight={maxHeight}
    >
      {children}
    </StyledListViewport>
  );
}
