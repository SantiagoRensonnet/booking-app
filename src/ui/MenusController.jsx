import { createContext, useContext, useRef, useState } from "react";
import styled from "styled-components";
import { HiEllipsisVertical } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: absolute;
  z-index: 1;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: -9px;
  top: 40px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext();

function MenusController({ children }) {
  const [openId, setOpenId] = useState(null);
  const [activeToggle, setActiveToggle] = useState(null);
  const open = setOpenId;
  const close = () => setOpenId(null);

  return (
    <MenusContext
      value={{ openId, open, close, activeToggle, setActiveToggle }}
    >
      {children}
    </MenusContext>
  );
}

function Menu({ children }) {
  return <StyledMenu>{children}</StyledMenu>;
}
function Toggle({ id }) {
  const { openId, open, close, setActiveToggle } = useContext(MenusContext);
  const ref = useRef();
  function handleToggleClick() {
    !openId || id !== openId ? open(id) : close();
    setActiveToggle(ref);
  }
  return (
    <StyledToggle ref={ref} onClick={handleToggleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}
function List({ id, children }) {
  const { openId } = useContext(MenusContext);
  if (openId !== id) return null;
  return <ListElement>{children}</ListElement>;
}
function ListElement({ children }) {
  const { close, activeToggle } = useContext(MenusContext);
  const { ref } = useOutsideClick({ close, triggerRef: activeToggle });

  return <StyledList ref={ref}>{children}</StyledList>;
}
function Button({ title, icon, disabled, onClick, closeOnClick, children }) {
  const { close } = useContext(MenusContext);
  function handleClick() {
    if (closeOnClick) close();
    onClick?.();
  }
  return (
    <li>
      <StyledButton title={title} disabled={disabled} onClick={handleClick}>
        {icon}
        {children}
      </StyledButton>
    </li>
  );
}

MenusController.Menu = Menu;
MenusController.Toggle = Toggle;
MenusController.Button = Button;
MenusController.List = List;

export default MenusController;
