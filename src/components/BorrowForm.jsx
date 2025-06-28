import { useState } from "react";

export default function BorrowForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("borrow");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !note) return;
    onAdd({ description, amount, type, note });
    setDescription("");
    setAmount("");
    setType("borrow");
    setNote("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
      <div className="flex flex-col sm:flex-row gap-4">

        <input
          type="text"
          placeholder="Name (Person)"
          className="border p-2 rounded w-full"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="borrow">Borrow</option>
          <option value="repay">Repay</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>
    </form>
  );
}
