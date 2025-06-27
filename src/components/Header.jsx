export default function Header({ user, logout }) {
  return (
    <div className="flex justify-between items-center bg-blue-600 text-white p-4 mb-6 rounded shadow">
      <h1 className="text-xl font-semibold">Loan Tracker</h1>
      <div className="flex items-center gap-4">
        <span>{user?.name}</span>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
