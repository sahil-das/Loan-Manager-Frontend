import React, { useState } from "react";
import BorrowForm from "./BorrowForm";
import ConfirmDialog from "./ConfirmDialog";

export default function BorrowDetail({ person, entries, onBack, onAdd, onEdit, onDelete }) {
  const filtered = entries.filter((e) => e.name === person).sort((a, b) => new Date(a.date) - new Date(b.date));

  let balance = 0;
  const [editId, setEditId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (entry) => {
    onAdd({ ...entry, name: person });
    setShowForm(false);
  };

  const handleUpdate = (id, entry) => {
    onEdit(id, { ...entry, name: person });
    setEditId(null);
  };

  const rows = filtered.map((e) => {
    if (e.type === "borrow") balance += Number(e.amount);
    else if (e.type === "repay") balance -= Number(e.amount);

    return editId === e._id ? (
      <tr key={e._id}>
        <td colSpan="5">
          <BorrowForm
            defaultValues={e}
            onAdd={(updated) => handleUpdate(e._id, updated)}
            isEdit
            onCancel={() => setEditId(null)}
          />
        </td>
      </tr>
    ) : (
      <tr key={e._id}>
        <td>{new Date(e.date).toLocaleDateString()}</td>
        <td>{e.type === "borrow" ? `Borrowed ₹${e.amount}` : `Repaid ₹${e.amount}`}</td>
        <td>₹{balance}</td>
        <td>
          <button className="text-blue-600" onClick={() => setEditId(e._id)}>Edit</button>
        </td>
        <td>
          <button className="text-red-600" onClick={() => setConfirmId(e._id)}>Delete</button>
        </td>
      </tr>
    );
  });

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

      {showForm && <BorrowForm onAdd={handleAdd} defaultValues={{ name: person }} />}

      <table className="w-full text-left text-sm sm:text-base">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Action</th>
            <th className="p-2">Balance After</th>
            <th className="p-2">Edit</th>
            <th className="p-2">Delete</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => {
          onDelete(confirmId);
          setConfirmId(null);
        }}
        message="Are you sure you want to delete this entry?"
      />
    </div>
  );
}