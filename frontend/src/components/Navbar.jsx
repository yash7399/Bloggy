import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const { navigate, token, userType, userData, logout } = useAppContext();

  return (
    <div className="sticky top-0 bg-white z-50">
      <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
        <h1
          onClick={() => navigate("/")}
          className="text-4xl font-bold text-primary cursor-pointer"
        >
          Bloggy
        </h1>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Welcome, {userData?.name || 'User'}
                </span>
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center rounded-full cursor-pointer bg-primary text-white px-6 py-2.5"
                >
                  {userType === "admin" ? "Admin Dashboard" : "My Dashboard"}
                </button>
              </div>
              <button
                onClick={logout}
                className="flex items-center rounded-full cursor-pointer border border-red-500 text-red-500 px-4 py-2 hover:bg-red-500 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center rounded-full cursor-pointer border border-primary text-primary px-6 py-2.5 hover:bg-primary hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center rounded-full cursor-pointer bg-primary text-white px-6 py-2.5"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
