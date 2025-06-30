import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmDialog from "./ConfirmDialog";

export default function BorrowList({ entries, onEdit, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    type: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleEditClick = (entry) => {
    setEditId(entry._id);
    setFormData({
      name: entry.name || "",
      description: entry.description || "",
      amount: entry.amount,
      type: entry.type,
    });
  };

  const handleSave = () => {
    onEdit(editId, formData);
    toast.success("Entry updated successfully");
    setEditId(null);
  };

  const askDeleteConfirmation = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      toast.success("Entry deleted");
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-2 px-2">Name</th>
              <th className="px-2">Description</th>
              <th className="px-2">Amount</th>
              <th className="px-2">Type</th>
              <th className="px-2">Date</th>
              <th className="px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id} className="border-b hover:bg-gray-50">
                {editId === entry._id ? (
                  <>
                    <td className="p-2">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
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
                    <td className="p-2">{new Date(entry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>

                    <td className="p-2 flex flex-col sm:flex-row gap-2">
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
                    <td className="p-2">{entry.name}</td>
                    <td className="p-2">{entry.description}</td>
                    <td className="p-2">₹{entry.amount}</td>
                    <td className="p-2">{entry.type}</td>
                    <td className="p-2">{new Date(entry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td className="p-2 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEditClick(entry)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => askDeleteConfirmation(entry._id)}
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

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this entry?"
      />
    </div>
  );
}
