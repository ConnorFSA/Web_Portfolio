import { useEffect, useRef, useState } from "react";
import "./ThemeToggle.css";
import Toggle from "./generic/Toggle";

type ThemeOption = {
  label: string;
  value: string;
};

// Gets the available theme options by inspecting the CSS rules in the documents stylesheets,
// looking for rules that contain a [data-theme="..."] selector.
function getThemeOptions(): ThemeOption[] {
  const themes = new Map<string, string>();
  themes.set("Default", "");

  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      Array.from(sheet.cssRules).forEach((rule) => {
        if (!(rule instanceof CSSStyleRule)) {
          return;
        }

        const match = rule.selectorText?.match(/\[data-theme="([^"]+)"\]/);
        if (!match?.[1]) {
          return;
        }

        const rawValue = match[1];
        const label = rawValue.charAt(0).toUpperCase() + rawValue.slice(1);
        themes.set(label, rawValue);
      });
    } catch {
      // Ignore stylesheets that cannot be inspected.
    }
  });

  return Array.from(themes.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// a component that allows the user to toggle between light and dark mode, as well as select a specific theme from a dropdown menu
function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme-mode") === "dark");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme-type") || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const themeOptions = getThemeOptions();

  // update the documents data-mode attribute and local storage when the isDark state changes
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", isDark ? "dark" : "");
    localStorage.setItem("theme-mode", isDark ? "dark" : "");
  }, [isDark]);

  // update the documents data-theme attribute and local storage when the theme state changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme) {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }

    localStorage.setItem("theme-type", theme);
  }, [theme]);

  // close the dropdown menu when clicking outside of it
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // handle the toggle switch change event
  const handleToggle = (isOn: boolean) => setIsDark(isOn);

  // change the theme and close the dropdown menu when a theme option is selected
  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    setIsMenuOpen(false);
  };

  return (
    <div className="theme-switch" ref={dropdownRef}>
      <Toggle value={isDark} onChange={handleToggle} />

      <button
        type="button"
        className={`theme-switch__trigger ${isMenuOpen ? "is-open" : ""}`}
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label="Change theme"
        aria-expanded={isMenuOpen}
      >
        <span className="theme-switch__icon" aria-hidden="true">
          ▾
        </span>
      </button>

      <div
        className={`theme-switch__menu ${isMenuOpen ? "is-open" : ""}`}
        role="menu"
        aria-label="Theme selection"
      >
        {themeOptions.map((option) => {
          const isSelected = option.value === theme;

          return (
            <button
              key={option.label}
              type="button"
              className={`theme-switch__option ${isSelected ? "is-selected" : ""}`}
              onClick={() => changeTheme(option.value)}
              role="menuitemradio"
              aria-checked={isSelected}
            >
              <span>{option.label}</span>
              {isSelected && <span className="theme-switch__check">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ThemeToggle;