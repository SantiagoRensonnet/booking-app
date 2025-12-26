import { Outlet } from "react-router";
import styled from "styled-components";

import Header from "../ui/Header";
import Sidebar from "../ui/Sidebar";

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  grid-column: 2/-1;
  overflow-y:auto;
`;

const StyledAppLayout = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

export default function AppLayout() {
  return (
    <StyledAppLayout>
      <Header>I'm the header</Header>
      <Sidebar>Sidebar baby</Sidebar>
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}
