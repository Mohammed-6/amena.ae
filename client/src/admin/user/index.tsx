import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import AdminPanel from "../layout/AdminPanel";
import { UserType } from "../types/admin";
import { deleteUser, listUser } from "../query/admin";
import { toast } from "react-toastify";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive";
}

const UsersList = () => {
  return (
    <>
      <AdminPanel>
        <Content />
      </AdminPanel>
    </>
  );
};
const Content = () => {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    listUser()
      .then((res) => {
        setUsers(res.data.user);
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.log(error);
      });
  }, []);

  const handleDelete = (id: string) => {
    deleteUser(id)
      .then((res) => {
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.log(error);
      });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-start items-center gap-x-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">User List</h2>
        </div>
        <div>
          <Link
            href="/admin/user/create"
            className="text-white bg-green-700 px-3 py-1.5 font-bold rounded-lg"
          >
            Add User
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, k) => (
              <tr key={k} className="border-b">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 text-center">
                  <Link
                    href={`/admin/user/${user._id}`}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(user?._id!)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
