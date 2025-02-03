import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./home.css";
import { StoreContext } from "../../context/context";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import NumberBar from "../../components/numberBar/NumberBar";
import Record from "../../components/record/Record";
import Analysis from "../../components/analysis/Analysis";
import Search from "../../components/Search/Search";
import AddDetails from "../../components/addDetails/AddDetails";

axios.defaults.withCredentials = true;

// Fetch user data function
const fetchUserData = async ({ queryKey }) => {
  const token = queryKey[1]; // Extract token from queryKey
  try {
    const response = await axios.get("https://subash-hotel-backend.vercel.app/api/user", {
      headers: {
        token: token,
      },
      withCredentials: true,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.user; // Return the user data
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user data!";
  }
};

const Home = () => {
  const { token,isOpen, setUserData, currentPage,setIsLoading} = useContext(StoreContext);

  // Use `useQuery` with object-based arguments (React Query v5 format)
  const { data: userData, isLoading, isError, error } = useQuery({
    queryKey: ["userData", token], // Unique query key with token as a dependency
    queryFn: fetchUserData, // Query function
    enabled: !!token, // Only run the query if token exists
    onSuccess: (data) => {
      setIsLoading(false)
      setUserData(data)
       // Update user data in context
      toast.success("User Data Fetched Successfully!");
    },
    onError: (err) => {
      toast.error(err); // Show error message
    },
  });
  useEffect(()=>{
    if(userData){setUserData(userData)}

  },[userData])
  // Loading state
  if (isLoading) {
    setIsLoading(true)
  }

  // Error state
  if (isError) {
    setIsLoading(true)
  }

  

  return (
    <div className="home">
      <Navbar/>
      {currentPage === "analysis" ? (
        <Analysis />
      ) : currentPage === "search" ? (
        <Search />
      ) : (
        <>
          <NumberBar searchDate={null} />
          <Record  isAddIcon = {true}/>
        </>
      )}
    
      <Footer />
    </div>
  );
};

export default Home;
