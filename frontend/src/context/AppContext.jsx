import { useContext } from "react";
import { createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin' or 'user'
  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      data.success ? setBlogs(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
    
    // Check for unified token
    const storedToken = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType");
    const storedUserData = localStorage.getItem("userData");
    
    if (storedToken && storedUserType) {
      setToken(storedToken);
      setUserType(storedUserType);
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
      axios.defaults.headers.common["Authorization"] = storedToken;
    }
  }, []);

  const logout = () => {
    setToken(null);
    setUserType(null);
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const value = {
    axios,
    navigate,
    token,
    setToken,
    userType,
    setUserType,
    userData,
    setUserData,
    blogs,
    setBlogs,
    input,
    setInput,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
