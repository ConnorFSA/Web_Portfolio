import { useState } from "react";
import "./ThemeToggle.css";
import Toggle from "./Toggle";

function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    const handleToggle = (isOn: boolean) => {
        setIsDark(isOn);
        const mode = isOn ? "dark" : "";
        document.documentElement.setAttribute("data-mode", mode);
        localStorage.setItem("theme-mode", mode);
    }

    return (
        <Toggle value={isDark} onChange={handleToggle}/>
    );
}

export default ThemeToggle 