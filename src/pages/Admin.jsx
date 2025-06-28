import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../context/useAuth";

const API = import.meta.env.VITE_API_URL;

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/admin/users`, { withCredentials: true });
        setUsers(res.data);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const promoteToAdmin = async (userId) => {
    setPromoting(userId);
    try {
      await axios.post(`${API}/admin/promote`, { userId }, { withCredentials: true });
      setUsers(users => users.map(u => u._id === userId ? { ...u, isAdmin: true } : u));
    } catch {
      alert("Failed to promote user");
    } finally {
      setPromoting("");
    }
  };

  if (!user || !user.isAdmin) return <div>Access denied</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Users & Data</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {users.map(u => (
            <div key={u._id} className="p-4 bg-white rounded shadow">
              <div className="font-bold">{u.name} ({u.email}) {u.isAdmin && <span className="text-green-600">[Admin]</span>}</div>
              <div className="text-sm text-gray-500">User ID: {u._id}</div>
              <div className="mt-2">
                <div className="font-semibold">Entries:</div>
                <ul className="list-disc ml-6">
                  {u.entries.map(e => (
                    <li key={e._id}>{e.type}: ₹{e.amount} ({e.note})</li>
                  ))}
                </ul>
              </div>
              {!u.isAdmin && (
                <button
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  onClick={() => promoteToAdmin(u._id)}
                  disabled={promoting === u._id}
                >
                  {promoting === u._id ? "Promoting..." : "Promote to Admin"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
