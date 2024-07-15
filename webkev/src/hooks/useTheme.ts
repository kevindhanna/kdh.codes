import { useContext } from "preact/hooks";
import { ThemeContext } from "../components/ThemeProvider";

export const useTheme = () => useContext(ThemeContext);
