import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { APP_SERVER_URL } from "@/src/utils/common";

const LoginWithEmail = () => {
  return (
    <>
      <LoginView />
      <ToastContainer />
    </>
  );
};

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const res = await axios.post(APP_SERVER_URL + "/api/partner/login", {
        email,
        password,
      });

      const { partner, token } = res.data;

      if (partner) {
        localStorage.setItem("partnerId", partner.id);
        localStorage.setItem("ptoken", token);
        if (partner.onboardingStatus) {
          localStorage.setItem("shopId", partner.shopid);
          window.location.href = "/partner/dashboard";
        } else {
          window.location.href = "/partner/onboarding";
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Abstract Circle Background */}
        <div className="absolute w-40 h-40 bg-purple-300 rounded-full top-[-60px] right-[-60px] opacity-30"></div>
        <div className="absolute w-32 h-32 bg-blue-300 rounded-full bottom-[-40px] left-[-40px] opacity-30"></div>

        {/* Logo */}
        <div className="flex justify-center mb-0">
          <img src="/logo.svg" alt="Logo" className="w-32 h-32" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Login / Register
        </h2>

        <form onSubmit={handleLogin}>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            className="w-full p-2 border rounded-md mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded-md mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginWithEmail;
