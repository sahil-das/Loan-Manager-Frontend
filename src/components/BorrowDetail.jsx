import React, { useState } from "react";
import BorrowForm from "./BorrowForm";
import ConfirmDialog from "./ConfirmDialog";

export default function BorrowDetail({ person, entries, onBack, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  // Filter and sort entries by this person
  const filtered = entries
    .filter((e) => e.name === person)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let balance = 0;

  const handleAdd = (entry) => {
    onAdd({ ...entry, name: person });
    setShowForm(false);
  };

  const requestDelete = (entryId) => {
    setEntryToDelete(entryId);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      onDelete(entryToDelete);
      setEntryToDelete(null);
    }
  };

  const rows = filtered.map((e) => {
    if (e.type === "borrow") balance += Number(e.amount);
    else if (e.type === "repay") balance -= Number(e.amount);

    return (
      <tr key={e._id} className="border-t">
        <td className="py-2">{new Date(e.date).toLocaleDateString()}</td>
        <td className="py-2">
          {e.type === "borrow" ? `Borrowed ₹${e.amount}` : `Repaid ₹${e.amount}`}
        </td>
        <td className="py-2">{balance}</td>
        <td className="py-2">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => onEdit?.(e._id, e)}
          >
            Edit
          </button>
        </td>
        <td className="py-2">
          <button
            className="text-red-600 hover:underline"
            onClick={() => requestDelete(e._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="bg-white p-4 rounded shadow">
      <button className="mb-4 text-blue-600 hover:underline" onClick={onBack}>
        &larr; Back to Overview
      </button>
      <h3 className="text-xl font-bold mb-2">Details for: {person}</h3>
      <button
        className="mb-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : `Add Borrow/Repay for ${person}`}
      </button>

      {showForm && <BorrowForm onAdd={handleAdd} />}

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 border-b">Date</th>
              <th className="py-2 px-3 border-b">Action</th>
              <th className="py-2 px-3 border-b">Balance After</th>
              <th className="py-2 px-3 border-b">Edit</th>
              <th className="py-2 px-3 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        message="Do you really want to delete this entry?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}