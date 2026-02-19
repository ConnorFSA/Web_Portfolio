import { useEffect, useState } from "react";
import "./ThemeToggle.css";
import Toggle from "./Toggle";

function ThemeToggle() {
    /* isDark is the current state of the toggle and setIsDark is a function
    that updates the the variable isDark and reloads the page */
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme-mode") === "dark";
    });

    /* Passed to the toggle component and called when the toggle is clicked 
    recieves a boolean value opposite of the current state, stores it in*/
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