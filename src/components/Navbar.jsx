import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const [showConfirmLogout, setShowConfirmLogout] = useState(false);


export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const routeTitles = {
    "/dashboard": "Dashboard",
    "/admin": "Admin Panel",
    "/login": "Login",
    "/signup": "Signup",
  };
  const currentTitle = routeTitles[location.pathname] || "Borrow Book";

  useEffect(() => {
    document.title = `${currentTitle} | Borrow Book`;
  }, [currentTitle]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const confirmLogout = () => {
  setShowConfirmLogout(true);
};

const handleLogoutConfirmed = () => {
  logout();
  toast.success("Logged out successfully!");
  navigate("/login");
  setShowConfirmLogout(false);
};


  const renderMenuItems = () => (
    <>
      {user?.isAdmin && (
        <Link to="/admin" onClick={() => setMenuOpen(false)} className="hover:underline">
          Admin
        </Link>
      )}
      {user ? (
        <>
          <span className="text-sm">{user.name}</span>
          <button
            onClick={confirmLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:underline">
            Login
          </Link>
          <Link to="/signup" onClick={() => setMenuOpen(false)} className="hover:underline">
            Signup
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-blue-600 text-white shadow mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left side: Brand */}
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-lg hover:underline">
            Borrow Book
          </Link>
        </div>

        {/* Hamburger button */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-4 ml-6">
          {renderMenuItems()}
        </div>
      </div>

      {/* Right-Aligned Mobile Dropdown */}
      <div
        className={`sm:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 flex justify-end">
          <div className="flex flex-col items-end gap-2 text-right">
            {renderMenuItems()}
          </div>
        </div>
      </div>
    </nav>
{showConfirmLogout && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white text-black p-6 rounded-lg shadow-md w-[90%] max-w-sm">
      <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
      <p className="mb-6">Are you sure you want to log out?</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowConfirmLogout(false)}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleLogoutConfirmed}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}
  );
}
