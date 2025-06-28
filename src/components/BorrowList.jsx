import { useState } from "react";

export default function BorrowList({ entries, onEdit, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    type: "",
  });

  const handleEditClick = (entry) => {
    setEditId(entry._id);
    setFormData({
      name: entry.name || entry.note || "",
      description: entry.description || "",
      amount: entry.amount,
      type: entry.type,
    });
  };

  const handleSave = () => {
    onEdit(editId, formData);
    setEditId(null);
  };

  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
      <table className="w-full text-left min-w-[700px]">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry._id} className="border-b hover:bg-gray-50">
              {editId === entry._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    >
                      <option value="borrow">Borrow</option>
                      <option value="repay">Repay</option>
                    </select>
                  </td>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{entry.name || entry.note || "-"}</td>
                  <td>{entry.description || "-"}</td>
                  <td>₹{entry.amount}</td>
                  <td>{entry.type}</td>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(entry)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(entry._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
