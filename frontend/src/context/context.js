import { useState, createContext } from "react";
import {  useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData,setUserData] = useState({});
  const [currentPage,setCurrentPage] = useState("record");
  const [records,setRecords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split("T")[0]);
  
  const queryClient = useQueryClient();
    
  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-records", {
        headers: { token },
        withCredentials: true,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setRecords(response.data.records);
    } catch (error) {
      toast.error(error.message || "Failed to fetch records data!");
    }
  };
  


  const contextValue = {
    token,
    setToken,
    userData,
    setUserData,
    currentPage,
    setCurrentPage,
    records,
    setRecords,
    isOpen,
    setIsOpen,
    queryClient,
    searchDate,
    setSearchDate,
    fetchRecords
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
