import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function BorrowForm({
  onAdd,
  defaultName = "",
  defaultValues = null,
  onCancel = null,
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("borrow");
  const [name, setName] = useState(defaultName);
  const [date, setDate] = useState("");

  // Load form data when editing
  useEffect(() => {
    if (defaultValues) {
      setDescription(defaultValues.description || "");
      setAmount(defaultValues.amount?.toString() || "");
      setType(defaultValues.type || "borrow");
      setName(defaultValues.name || defaultName);
      setDate(defaultValues.date?.split("T")[0] || new Date().toISOString().split("T")[0]);
    } else {
      resetForm(); // reset if not editing
    }
  }, [defaultValues, defaultName]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("borrow");
    setName(defaultName);
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

    if (!amount || isNaN(amount) || Number(amount) <= 0 || (!name && !defaultName)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const finalName = capitalizeWords((defaultName || name).trim());

    const entry = {
      name: finalName,
      description: description.trim(),
      amount: Number(amount),
      type,
      date,
    };

    onAdd(entry);

    if (!defaultValues) {
      toast.success("Entry added successfully!");
      resetForm();
    } else {
      toast.success("Entry updated successfully!");
    }
  };

  const isSubmitDisabled = !amount || Number(amount) <= 0 || (!name && !defaultName);

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow w-full">
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
        {!defaultName && (
          <input
            type="text"
            placeholder="Name (Person)"
            className="border p-2 rounded w-full md:flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="text"
          placeholder="Description (optional)"
          className="border p-2 rounded w-full md:flex-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            isSubmitDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {defaultValues ? "Update" : "Add"}
        </button>

        {defaultValues && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-white px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded w-full md:w-auto"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
