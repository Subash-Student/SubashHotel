import React, { useContext } from "react";
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
    const response = await axios.get("http://localhost:5000/api/user", {
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
  const { token,isOpen, setUserData, currentPage } = useContext(StoreContext);

  // Use `useQuery` with object-based arguments (React Query v5 format)
  const { data: userData, isLoading, isError, error } = useQuery({
    queryKey: ["userData", token], // Unique query key with token as a dependency
    queryFn: fetchUserData, // Query function
    enabled: !!token, // Only run the query if token exists
    onSuccess: (data) => {
      setUserData(data); // Update user data in context
      toast.success("User Data Fetched Successfully!");
    },
    onError: (err) => {
      toast.error(err); // Show error message
    },
  });

  // Loading state
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  // Error state
  if (isError) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <div className="home">
      <Navbar />
      {currentPage === "analysis" ? (
        <Analysis />
      ) : currentPage === "search" ? (
        <Search />
      ) : (
        <>
          <NumberBar />
          <Record />
        </>
      )}
    
      <Footer />
    </div>
  );
};

export default Home;
