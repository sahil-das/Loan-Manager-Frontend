import React, { useState } from "react";
import BorrowForm from "./BorrowForm";

export default function BorrowDetail({ person, entries, onBack, onAdd, onEdit, onDelete }) {
  // Filter entries for this person
  const filtered = entries.filter(e => e.note === person);
  // Sort by date
  filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
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
          <button className="text-blue-600 mr-2" onClick={() => onEdit && onEdit(e._id, e)}>Edit</button>
          <button className="text-red-600" onClick={() => onDelete && onDelete(e._id)}>Delete</button>
        </td>
      </tr>
    );
  });
  // Add form state
  const [showForm, setShowForm] = useState(false);
  const handleAdd = (entry) => {
    onAdd({ ...entry, note: person });
    setShowForm(false);
  };
  return (
    <div className="bg-white p-4 rounded shadow">
      <button className="mb-4 text-blue-600" onClick={onBack}>&larr; Back to Overview</button>
      <h3 className="text-xl font-bold mb-2">Details for: {person}</h3>
      <button className="mb-4 px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : `Add Borrow/Repay for ${person}`}
      </button>
      {showForm && <BorrowForm onAdd={handleAdd} defaultNote={person} />}
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Date</th>
            <th>Action</th>
            <th>Balance After</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
