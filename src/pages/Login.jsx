import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import Loading from "../components/Loading"

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- Add this
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });  // prevent going back
    }
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      await login(email.toLowerCase(), password);
      navigate("/");
    } catch {
      setError("Invalid email or password");
      setLoading(false)

    } 
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-pink-100 to-blue-100">
      {loading && <Loading />} {/* <- Loader shown during login */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 w-full rounded hover:bg-blue-600 flex items-center justify-center disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
