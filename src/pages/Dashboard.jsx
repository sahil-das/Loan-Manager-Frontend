import { useEffect, useState } from "react";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BorrowForm from "../components/BorrowForm";
import BorrowList from "../components/BorrowList";
import BorrowDetail from "../components/BorrowDetail";
import generatePDF from "../utils/generatePDF";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const { user, authLoading, logout } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API}/borrow`, { withCredentials: true });
      setEntries(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setEntries([]);
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

  const grouped = {};
  entries.forEach((e) => {
    const person = e.name || "(No Name)";
    if (!grouped[person]) grouped[person] = [];
    grouped[person].push(e);
  });

  const overviewRows = Object.entries(grouped).map(([person, list]) => {
    const totalBorrow = list
      .filter((e) => e.type === "borrow")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const totalRepay = list
      .filter((e) => e.type === "repay")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const outstanding = totalBorrow - totalRepay;
    const lastDate = list.length
      ? new Date(Math.max(...list.map((e) => new Date(e.date)))).toLocaleDateString()
      : "-";

    return (
      <tr
        key={person}
        className="hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
        onClick={() => setSelectedPerson(person)}
      >
        <td className="p-2 font-semibold">{person}</td>
        <td className="p-2">₹{totalBorrow}</td>
        <td className="p-2">₹{totalRepay}</td>
        <td className="p-2">₹{outstanding}</td>
        <td className="p-2">{lastDate}</td>
      </tr>
    );
  });

  const totalBorrowed = entries
    .filter((e) => e.type === "borrow")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const totalPaid = entries
    .filter((e) => e.type === "repay")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const outstanding = totalBorrowed - totalPaid;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Borrow / Repay</h2>

        {selectedPerson ? (
          <BorrowDetail
            person={selectedPerson}
            entries={entries}
            onBack={() => setSelectedPerson(null)}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <>
            <BorrowForm onAdd={handleAdd} />

            {loading ? (
              <p className="text-center mt-6">Loading...</p>
            ) : (
              <>
                <div className="mb-6 overflow-x-auto">
                  <h3 className="text-lg font-bold mb-3 text-center sm:text-left">
                    Overview by Person
                  </h3>
                  <table className="min-w-full text-left bg-white rounded shadow text-sm sm:text-base">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2">Person</th>
                        <th className="p-2">Total Borrowed</th>
                        <th className="p-2">Total Repaid</th>
                        <th className="p-2">Outstanding</th>
                        <th className="p-2">Last Date</th>
                      </tr>
                    </thead>
                    <tbody>{overviewRows}</tbody>
                  </table>
                </div>

                <div className="flex justify-center sm:justify-end mb-4">
                  <button
                    onClick={() => generatePDF(grouped)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Download PDF
                  </button>
                </div>

                <BorrowList
                  entries={entries}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

                <div className="mt-6 p-4 bg-white rounded shadow text-center text-sm sm:text-base">
                  <p>Total Borrowed: ₹{totalBorrowed}</p>
                  <p>Total Repaid: ₹{totalPaid}</p>
                  <p className="font-bold text-lg mt-2">
                    Outstanding: ₹{outstanding}
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
