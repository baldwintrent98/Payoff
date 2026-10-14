
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (formData.password.length < 8) {
            setError("Your password must contain at least 8 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Your passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        first_name: formData.first_name.trim(),
                        last_name: formData.last_name.trim(),
                        email: formData.email.trim(),
                        password: formData.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Unable to create your account."
                );
            }

            // Registration succeeded. Navigate to login.
            navigate("/login", {
                state: {
                    message: "Account created successfully! Please log in.",
                },
            });
        } catch (err) {
            setError(
                err.message || "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="register-page">
            <section className="register-card">
                <div className="register-heading">
                    <h1>Create your account</h1>
                    <p>
                        Start planning your student debt payoff journey.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="register-name-row">
                        <div className="register-field">
                            <label htmlFor="first_name">
                                First name
                            </label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                autoComplete="given-name"
                                value={formData.first_name}
                                onChange={handleChange}
                                maxLength={45}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="last_name">
                                Last name
                            </label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                autoComplete="family-name"
                                value={formData.last_name}
                                onChange={handleChange}
                                maxLength={45}
                                required
                            />
                        </div>
                    </div>

                    <div className="register-field">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            maxLength={254}
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="password">Password</label>

                        <div className="register-password-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                maxLength={128}
                                required
                            />

                            <button
                                type="button"
                                className="register-toggle-password"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <small>Use at least 8 characters.</small>
                    </div>

                    <div className="register-field">
                        <label htmlFor="confirmPassword">
                            Confirm password
                        </label>

                        <div className="register-password-wrapper">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                maxLength={128}
                                required
                            />

                            <button
                                type="button"
                                className="register-toggle-password"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) => !previous
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="register-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        className="register-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="register-login-link">
                    Already have an account?{" "}
                    <Link to="/login">Log in</Link>
                </p>
            </section>
        </main>
    );
}

export default Register;
