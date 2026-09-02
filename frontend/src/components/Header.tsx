import { NavLink } from "react-router-dom";
import "./Header.css";
import ThemeToggle from "./ThemeToggle";

function Header() {
  // The header keeps the primary navigation centrally aligned while reserving the
  // outer edges for non-navigation controls such as the theme switch.
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__side site-header__side--left" aria-hidden="true" />

        <nav className="site-header__nav" aria-label="Main navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "site-header__link is-active" : "site-header__link"
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "site-header__link is-active" : "site-header__link"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "site-header__link is-active" : "site-header__link"
            }
          >
            Projects
          </NavLink>
        </nav>

        <div className="site-header__side site-header__side--right">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
