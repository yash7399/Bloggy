


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { axios, setToken, setUserType } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError(""); // Clear any previous error
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/user/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      if (data.success) {
        // Store unified token and user type
        setToken(data.token);
        setUserType(data.user.role);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.user.role);
        localStorage.setItem("userData", JSON.stringify(data.user));
        axios.defaults.headers.common["Authorization"] = data.token;
        
        toast.success("Registration successful! Welcome to your dashboard!");
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // Navigate to admin dashboard (since all users get dashboard access)
        navigate("/admin");
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
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
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="font-light">
              Enter your credentials to register your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:max-w-md text-gray-600"
          >
            <div className="flex flex-col">
              <label>Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                placeholder="Enter your name"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                autoComplete="name"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col">
              <label>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder="Enter your email"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col relative">
              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                required
                placeholder="Your password"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6 pr-10"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-9 text-sm text-blue-500 cursor-pointer select-none"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <div className="flex flex-col relative">
              <label>Confirm Password</label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm your password"
                className="border-b-2 border-gray-300 p-2 outline-none mb-2 pr-10"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-2 top-9 text-sm text-blue-500 cursor-pointer select-none"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </span>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
                  Registering...
                </div>
              ) : (
                "Register"
              )}
            </button>

            {/* Already registered? Link to login */}
            <p className="text-sm text-center mt-4 text-gray-600">
              Already registered?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
