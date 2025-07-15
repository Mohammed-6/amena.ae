import { useEffect, useState } from "react";
import AdminPanel from "../layout/AdminPanel";
import { toast } from "react-toastify";
import { createUser, getUser, updateUser } from "@/src/admin/query/admin";
import { useRouter } from "next/router";

const UserCreateForm = () => {
  return (
    <>
      <AdminPanel>
        <Content />
      </AdminPanel>
    </>
  );
};
const Content = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "User",
    password: "",
  });

  const { editid } = router.query;

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editid) {
      getUser(editid as string).then((res) => {
        if (res.data.user !== null) {
          setFormData(res.data.user);
        }
      });
    }
  }, [editid]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editid) {
      const { password, ...requiredFields } = formData; // Exclude password from validation

      if (Object.values(requiredFields).some((value) => value === "")) {
        toast.error("Please fill in all required fields before submitting.");
        return;
      }
      await updateUser(editid as string, formData)
        .then((res) => {
          toast.success(res.data.message);
          setFormData({
            name: "",
            email: "",
            phone: "",
            role: "",
            password: "",
          });
          router.push("/admin/user");
        })
        .catch((error) => {
          toast.error("Something went wrong");
          console.log(error);
        });
    } else {
      if (Object.values(formData).some((value) => value === "")) {
        toast.error("Please fill in all fields before submitting.");
        return;
      }

      await createUser(formData)
        .then((res) => {
          toast.success(res.data.message);
          setFormData({
            name: "",
            email: "",
            phone: "",
            role: "",
            password: "",
          });
          router.push("/admin/user");
        })
        .catch((error) => {
          toast.error("Something went wrong");
          console.log(error);
        });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded pr-10"
              required={!editid}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editid ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default UserCreateForm;
