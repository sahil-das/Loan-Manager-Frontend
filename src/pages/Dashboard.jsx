import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import BorrowForm from "../components/BorrowForm";
import BorrowList from "../components/BorrowList";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const { user, authLoading, logout } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API}/borrow`, { withCredentials: true });
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (entry) => {
    const res = await axios.post(`${API}/borrow`, entry, { withCredentials: true });
    setEntries([...entries, res.data]);
  };

  const handleEdit = async (id, updatedEntry) => {
    await axios.put(`${API}/borrow/${id}`, updatedEntry, { withCredentials: true });
    setEntries(entries.map((e) => (e._id === id ? { ...e, ...updatedEntry } : e)));
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/borrow/${id}`, { withCredentials: true });
    setEntries(entries.filter((e) => e._id !== id));
  };

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
    if (user) fetchEntries();
  }, [user, authLoading]);

  const totalBorrowed = entries
    .filter((e) => e.type === "borrow")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const totalPaid = entries
    .filter((e) => e.type === "repay")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const outstanding = totalBorrowed - totalPaid;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Header user={user} logout={logout} />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Manage Borrow / Repay</h2>
        <BorrowForm onAdd={handleAdd} />
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <BorrowList
            entries={entries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        <div className="mt-6 p-4 bg-white rounded shadow text-center">
          <p>Total Borrowed: ₹{totalBorrowed}</p>
          <p>Total Repaid: ₹{totalPaid}</p>
          <p className="font-bold text-lg">
            Outstanding: ₹{outstanding}
          </p>
        </div>
      </div>
    </div>
  );
}
