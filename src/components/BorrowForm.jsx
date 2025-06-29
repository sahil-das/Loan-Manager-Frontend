import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function BorrowForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("borrow");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameRef = useRef(null); // for auto-focus

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    nameRef.current?.focus(); // auto-focus on mount
  }, []);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("borrow");
    setName("");
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    nameRef.current?.focus();
  };

  const capitalizeWords = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0 || !name.trim()) {
      toast.error("Please fill in Name and Amount correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedName = capitalizeWords(name.trim());

      const entry = {
        name: formattedName,
        description: description.trim(), // optional
        amount: Number(amount),
        type,
        date,
      };

      await onAdd(entry);
      toast.success("Entry added successfully!");
      resetForm();
    } catch (err) {
      toast.error("Failed to add entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = !amount || !name || Number(amount) <= 0 || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-white p-4 rounded shadow w-full"
    >
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
        <input
          ref={nameRef}
          type="text"
          placeholder="Name (Person)"
          className="border p-2 rounded w-full md:flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="Person's Name"
          title="Enter the person's name"
        />

        <input
          type="text"
          placeholder="Description (optional)"
          className="border p-2 rounded w-full md:flex-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Description"
          title="Enter optional description"
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded w-full md:w-32"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
          aria-label="Amount"
          title="Enter a valid amount greater than 0"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full md:w-32"
          aria-label="Transaction Type"
        >
          <option value="borrow">Borrow</option>
          <option value="repay">Repay</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded w-full md:w-40"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Date"
        />

        <div className="flex gap-2 w-full md:w-auto">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`text-white px-4 py-2 rounded w-full md:w-auto ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="text-gray-600 border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}