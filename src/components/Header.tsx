import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useAdmin } from "../context/AdminContext";
import AdminLogin from "./AdminLogin";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, logout } = useAdmin();
  const [loginOpen, setLoginOpen] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      logout();
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <header>
      <nav>
        <div className="logo">Favour.</div>

        <ul className={menuOpen ? "nav-links active" : "nav-links"}>
          <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
          <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
          <li><a href="#skills" onClick={() => setMenuOpen(false)}>Skills</a></li>
          <li><a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a></li>
          <li><a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a></li>
          <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button
            className="theme-toggle"
            onClick={handleAdminClick}
            aria-label={isAdmin ? "Log out of admin mode" : "Log in as admin"}
            title={isAdmin ? "Admin mode on — click to log out" : "Admin login"}
          >
            {isAdmin ? "🔓" : "🔒"}
          </button>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {loginOpen && <AdminLogin onClose={() => setLoginOpen(false)} />}
    </header>
  );
}
 
