import { HiOutlineLogout } from "react-icons/hi";
import useLogout from "../features/authentication/useLogout";

import ButtonIcon from "../ui/ButtonIcon";
import SpinnerMini from "../ui/SpinnerMini";
export default function Logout() {
  const { isLoading, logout } = useLogout();
  function handleLogout() {
    logout();
  }
  return (
    <ButtonIcon disabled={isLoading} onClick={handleLogout}>
      {isLoading ? <SpinnerMini /> : <HiOutlineLogout />}
    </ButtonIcon>
  );
}
