import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const { axios, setToken, setUserType } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/user/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (data.success) {
        // Store token and user type
        setToken(data.token);
        setUserType(data.user.role);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.user.role);
        localStorage.setItem("userData", JSON.stringify(data.user));
        axios.defaults.headers.common["Authorization"] = data.token;
        
        toast.success("Login successful! Welcome back!");
        // Clear form
        setEmail("");
        setPassword("");
        
        // Navigate based on role
        if (data.user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="font-light">
              Enter your credentials to access your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:max-w-md text-gray-600"
          >
            <div className="flex flex-col">
              <label>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder="Enter your email"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col">
              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                required
                placeholder="Enter your password"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                disabled={isLoading}
              />
            </div>

            <button
              className={`w-full py-3 font-medium text-white rounded transition-all ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-primary hover:bg-primary/90 cursor-pointer"
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>

            <p className="text-sm text-center mt-4 text-gray-600">
              Not registered?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
