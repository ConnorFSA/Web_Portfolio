import { NavLink } from "react-router-dom";
import "./Header.css";
import ThemeToggle from "./ThemeToggle";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Projects
          </NavLink>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
