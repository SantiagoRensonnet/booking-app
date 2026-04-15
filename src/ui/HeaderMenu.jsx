import styled from "styled-components";
import { HiOutlineUser } from "react-icons/hi";

import { useNavigate } from "react-router";
import Logout from "../pages/Logout";
import ButtonIcon from "./ButtonIcon";

const StyledMenu = styled.ul`
display:flex;
gap:0.4rem;
`;
export default function HeaderMenu() {
  const navigate = useNavigate();
  return (
    <StyledMenu>
      <li>
        <ButtonIcon onClick={() => navigate("/account")}>
          <HiOutlineUser />
        </ButtonIcon>
      </li>
      <li>
        <Logout />
      </li>
    </StyledMenu>
  );
}
