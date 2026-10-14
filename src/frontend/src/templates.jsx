
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./css/App.css";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate("/login", { replace: true });
    };

    const getLinkClass = ({ isActive }) =>
        isActive ? "navbar-link active" : "navbar-link";

    return (
        <header className="navbar">
            <NavLink
                to="/"
                className="navbar-brand"
                onClick={closeMenu}
            >
                Pay<span>off</span>
            </NavLink>

            <button
                className="navbar-toggle"
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? "✕" : "☰"}
            </button>

            <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
                <NavLink
                    to="/"
                    end
                    className={getLinkClass}
                    onClick={closeMenu}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/loans"
                    className={getLinkClass}
                    onClick={closeMenu}
                >
                    My Loans
                </NavLink>

                <NavLink
                    to="/payoff"
                    className={getLinkClass}
                    onClick={closeMenu}
                >
                    Payoff Planner
                </NavLink>

                <NavLink
                    to="/about"
                    className={getLinkClass}
                    onClick={closeMenu}
                >
                    About
                </NavLink>

                <button
                    type="button"
                    className="navbar-link navbar-logout"
                    onClick={handleLogout}
                >
                    Log Out
                </button>
            </nav>
        </header>
    );
}

export default Navbar;
