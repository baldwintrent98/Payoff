
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./templates.jsx";
import Login from "./pages/login";
import Register from "./pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import "./css/App.css";
import "./index.css";

function Dashboard() {
    return (
        <main className="page-content">
            <h1>Student Loan Planner</h1>
            <p>Plan your student debt before graduation.</p>
        </main>
    );
}

function Loans() {
    return (
        <main className="page-content">
            <h1>My Loans</h1>
            <p>View and manage your student loans here.</p>
        </main>
    );
}

function PayoffPlanner() {
    return (
        <main className="page-content">
            <h1>Payoff Planner</h1>
            <p>Explore repayment strategies and projected payoff dates.</p>
        </main>
    );
}

function About() {
    return (
        <main className="page-content">
            <h1>About</h1>
            <p>Learn how the Student Loan Planner works.</p>
        </main>
    );
}

function NotFound() {
    return (
        <main className="page-content">
            <h1>Page not found</h1>
        </main>
    );
}

function App() {
    const location = useLocation();

    const isPublicPage = ["/login", "/register"].includes(
        location.pathname
    );

    return (
        <>
            {!isPublicPage && <Navbar />}

            <Routes>
                {/* Public pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected pages */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/loans" element={<Loans />} />
                    <Route path="/payoff" element={<PayoffPlanner />} />
                    <Route path="/about" element={<About />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
