import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <nav className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <div className="font-bold text-lg">
        <Link to="/">Borrow Book</Link>
      </div>
      <div className="space-x-4">
        {user && user.isAdmin && (
          <Link to="/admin" className="hover:underline">Admin</Link>
        )}
        {user ? (
          <span>{user.name}</span>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
