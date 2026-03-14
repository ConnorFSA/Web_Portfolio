import { useState } from "react";
import "./ThemeToggle.css";
import DropDownSelector from "./DropDownSelector";
import Toggle from "./Toggle";

function GetThemeList() {
    // Create new set Class instance, Set ignores duplicates!
    const themes = new Set<string>();

    // default data theme doesnt exist, becomes alias for root Style.
    themes.add("Default");

    // loops through all stylesheets 
    Array.from(document.styleSheets).forEach(sheet => {
        try {
            Array.from(sheet.cssRules).forEach(rule => {
                if (rule instanceof CSSStyleRule) {
                    /* 
                    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet
                    Dont know if i will use regex again so ill leave this short
                    breakdown of how this expression works fo rfuture me.

                    extract the theme name from the selectorText.
                        /.../   regex expresison delimiters.
                        \[      escapes the regex function of the [ character.
                    regex expression looks for strings starting with 
                    [data-theme=" and ending with "] allowing any other string that
                    meets the conditions defined in the brackets () to be valid and
                    get retrieved.
                        ()      start (, and stop ), saving text
                        []      character class. [apc] exact [a-b] range.
                                characters must match one of the defined characters
                        [^x]    negated character class. matches anything besides
                        +       matches character / character class 1 for more times
                    */
                    const match = rule.selectorText.match(/\[data-theme="([^"]+)"\]/);
                    if (match && match[1]) {
                        themes.add(match[1]);
                    }
                }
            });
        } catch (e) {}
    });
    return Array.from(themes).sort();
}

function ThemeToggle() {
    /* isDark is the current state of the toggle and setIsDark is a function
    that updates the the variable isDark and reloads the page */
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme-mode") === "dark";
    });

    // Set the initial theme 
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme-type") || "";
    });

    /* Passed to the toggle component and called when the toggle is clicked 
    recieves a boolean value opposite of the current state, stores it in*/
    const handleToggle = (isOn: boolean) => {
        setIsDark(isOn);
        const mode = isOn ? "dark" : "";
        document.documentElement.setAttribute("data-mode", mode);
        localStorage.setItem("theme-mode", mode);
    }

    // Set theme, update local storage and call hook to reload dom
    const changeTheme = (newTheme : string) => {
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme)
        localStorage.setItem("theme-type", newTheme);
    }

    return (
        <div>
            <Toggle value={isDark} onChange={handleToggle} />
            <DropDownSelector option={theme} options={GetThemeList()} setOption={changeTheme}/>
        </div>
    );
}

export default ThemeToggle 