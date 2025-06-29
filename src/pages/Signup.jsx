import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import Loading from "../components/Loading";

export default function Signup() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    // Password validation: must be more than 6 characters
    if (password.length < 6) {
      setErr("Password must be minimum 6 characters");
      setLoading(false);
      return;
    }

    // Phone validation: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setErr("Phone number must be exactly 10 digits");
      setLoading(false);
      return;
    }

    try {
      await signup(name, email.toLowerCase(), phone, password);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErr(err.response.data.message);
      } else {
        setErr("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-yellow-100 to-teal-100">
      {loading && <Loading />}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {err && <p className="text-red-500 text-sm mb-4">{err}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="Full name"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
        />

        <input
          type="tel"
          placeholder="Phone"
          className="w-full p-2 mb-1 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          aria-label="Phone number"
        />
        {phone && !/^\d{10}$/.test(phone) && (
          <p className="text-red-500 text-xs mb-3">
            Phone number must be exactly 10 digits
          </p>
        )}

        <div className="relative mb-1">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
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
        {password && password.length <= 6 && (
          <p className="text-red-500 text-xs mb-3">
            Password must be more than 6 characters
          </p>
        )}

        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 w-full rounded hover:bg-green-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
