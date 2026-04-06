import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../redux/usersSlice";

export default function Admin() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);

  const [newUser, setNewUser] = useState({
    username: "",
    role: "Cashier",
    password: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSaveUser = async () => {
    if (!newUser.username.trim()) return;
    if (editingUserId === null && !newUser.password) return;

    try {
      if (editingUserId !== null) {
        await dispatch(
          updateUser({ id: editingUserId, user: newUser })
        ).unwrap();
      } else {
        await dispatch(addUser(newUser)).unwrap();
      }

      setNewUser({ username: "", role: "Cashier", password: "" });
      setEditingUserId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      const msg =
        typeof err === "string"
          ? err
          : err?.msg || err?.message || "Could not save user";
      window.alert(msg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
    } catch (err) {
      console.error(err);
      const msg =
        typeof err === "string"
          ? err
          : err?.msg || err?.message || "Could not delete user";
      window.alert(msg);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.user_id);
    setNewUser({
      username: user.username,
      role: user.role,
      password: "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setNewUser({ username: "", role: "Cashier", password: "" });
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add User
      </button>

      {showForm && (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <input
            type="text"
            placeholder="Username"
            className="border p-2 w-full mb-2"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder={
              editingUserId
                ? "New password (optional)"
                : "Password"
            }
            className="border p-2 w-full mb-2"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <select
            className="border p-2 w-full mb-2"
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
          >
            <option>Admin</option>
            <option>Pharmacist</option>
            <option>Cashier</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveUser}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {editingUserId ? "Update" : "Save"}
            </button>
            {editingUserId && (
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Username</th>
            <th className="p-2">Role</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="border-t">
              <td className="p-2">{user.user_id}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.user_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}