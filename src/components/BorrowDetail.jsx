import React, { useState } from "react";
import BorrowForm from "./BorrowForm";
import ConfirmDialog from "./ConfirmDialog";

export default function BorrowDetail({ person, entries, onBack, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  // Filter and sort entries for this person
  const filtered = entries.filter((e) => e.name === person).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate running balance
  let balance = 0;
  const rows = filtered.map((e) => {
    if (e.type === "borrow") balance += Number(e.amount);
    else if (e.type === "repay") balance -= Number(e.amount);

    return (
      <tr key={e._id}>
        <td>{new Date(e.date).toLocaleDateString()}</td>
        <td>{e.type === "borrow" ? `Borrowed ₹${e.amount}` : `Repaid ₹${e.amount}`}</td>
        <td>{balance}</td>
        <td>
          <button className="text-blue-600" onClick={() => onEdit && onEdit(e._id, e)}>
            Edit
          </button>
        </td>
        <td>
          <button
            className="text-red-600"
            onClick={() => {
              setToDeleteId(e._id);
              setConfirmOpen(true);
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  const handleConfirmDelete = () => {
    if (toDeleteId && onDelete) {
      onDelete(toDeleteId);
    }
    setToDeleteId(null);
  };

  const handleAdd = (entry) => {
    onAdd({ ...entry, name: person });
    setShowForm(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <button className="mb-4 text-blue-600" onClick={onBack}>
        &larr; Back to Overview
      </button>
      <h3 className="text-xl font-bold mb-2">Details for: {person}</h3>

      <button
        className="mb-4 px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : `Add Borrow/Repay for ${person}`}
      </button>

      {showForm && <BorrowForm onAdd={handleAdd} defaultName={person} />}

      <table className="w-full text-left border-t mt-4">
        <thead>
          <tr className="border-b">
            <th className="py-2">Date</th>
            <th className="py-2">Action</th>
            <th className="py-2">Balance After</th>
            <th className="py-2">Edit</th>
            <th className="py-2">Delete</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this entry?"
      />
    </div>
  );
}