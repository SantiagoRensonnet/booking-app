import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    false,
    "isDarkMode",
  );
  const toggleDarkMode = () => setIsDarkMode((mode) => !mode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light-mode");
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.documentElement.classList.add("light-mode");
    }
  }, [isDarkMode]);
  return (
    <DarkModeContext value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext>
  );
}
function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error("DarkModeContext was used outside DarkModeProvider");
  return context;
}
export { DarkModeProvider, useDarkMode };
