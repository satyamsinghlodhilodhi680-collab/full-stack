
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sprout } from "lucide-react";
import api from "../services/api";
function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        if (response.data.success) {
            if (response.data.user.role !== "admin") {
                setMessage("Access denied. Admin account required.");
                return;
            }

            navigate("/admin/dashboard");
        }
    } catch (error) {
        setMessage(
            error.response?.data?.message ||
            "Login failed. Please try again."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f5f7f6] px-4 py-10">

            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-lg shadow-gray-200/50 sm:p-10">

                <div className="mb-7 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-800">
                        <Sprout size={30} />
                    </div>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to your Gaon Connect admin account
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">

                    <div>
                        <label
                            htmlFor="admin-email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>

                        <input
                            id="admin-email"
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="admin-password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-green-800"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
    type="submit"
    disabled={loading}
    className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-700/20 disabled:cursor-not-allowed disabled:opacity-60"
>
    {loading ? "Signing in..." : "Login"}
</button>

{message && (
    <p
        role="alert"
        className="mt-3 text-center text-sm text-red-600"
    >
        {message}
    </p>
)}

                </form>

                <div className="mt-6 border-t border-gray-100 pt-5 text-center">
                    <Link
                        to="/"
                        className="text-sm font-medium text-gray-500 transition hover:text-green-800"
                    >
                        ← Back to Website
                    </Link>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Gaon Connect · Village Community Portal
                </p>

            </div>
        </main>
    );
}

export default AdminLogin;
