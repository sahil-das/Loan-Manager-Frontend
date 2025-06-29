import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function BorrowForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("borrow");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  // Auto-fill today's date on component mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("borrow");
    setName("");
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  };

  const capitalizeWords = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim() || !amount || isNaN(amount) || Number(amount) <= 0 || !name.trim()) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    const formattedName = capitalizeWords(name.trim());

    const entry = {
      name: formattedName,
      description: description.trim(),
      amount: Number(amount),
      type,
      date,
    };

    onAdd(entry);
    toast.success("Entry added successfully!");
    resetForm();
  };

  const isSubmitDisabled = !description || !amount || !name || Number(amount) <= 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-white p-4 rounded shadow w-full"
    >
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
        <input
          type="text"
          placeholder="Name (Person)"
          className="border p-2 rounded w-full md:flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded w-full md:flex-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded w-full md:w-32"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full md:w-32"
        >
          <option value="borrow">Borrow</option>
          <option value="repay">Repay</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded w-full md:w-40"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`text-white px-4 py-2 rounded w-full md:w-auto ${
            isSubmitDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Add
        </button>
      </div>
    </form>
  );
}
