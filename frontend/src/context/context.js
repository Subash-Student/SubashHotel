import { useState, createContext } from "react";
import axios from "axios"



export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData,setUserData] = useState({});
    const [currentPage,setCurrentPage] = useState("record");
const [records,setRecords] = useState([]);
const [isOpen, setIsOpen] = useState(false);

    

  


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
    setIsOpen
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
