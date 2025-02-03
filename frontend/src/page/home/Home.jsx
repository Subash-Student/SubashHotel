import React, { useContext } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./home.css";
import {CirclesWithBar} from "react-loader-spinner"
import { StoreContext } from "../../context/context";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import NumberBar from "../../components/numberBar/NumberBar";
import Record from "../../components/record/Record";
import Analysis from "../../components/analysis/Analysis";
import Search from "../../components/Search/Search";

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
  const { token, setUserData, currentPage, setIsLoading } = useContext(StoreContext);

  // Use `useQuery` with object-based arguments (React Query v5 format)
  const { data: userData, isLoading, isError, error } = useQuery({
    queryKey: ["userData", token], // Unique query key with token as a dependency
    queryFn: fetchUserData, // Query function
    enabled: !!token, // Only run the query if token exists
    onSuccess: (data) => {
      setIsLoading(false);
      setUserData(data); // Update user data in context
      toast.success("User Data Fetched Successfully!");
    },
    onError: (err) => {
      setIsLoading(false);
      toast.error(err); // Show error message
    },
  });

  // Loading state
  if (isLoading) {
    setIsLoading(true);
    return null; // Optionally, you can return a loading spinner here
  }

  // Error state
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="home">
      <Navbar />
      {isLoading ?
      <div className="spinner">
      <CirclesWithBar
          height="100"
          width="100"
          color="#4fa94d"
          outerCircleColor="#4fa94d"
          innerCircleColor="#4fa94d"
          barColor="#4fa94d"
          ariaLabel="circles-with-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true} />

      </div>
    :<>
        {currentPage === "analysis" ? (
        <Analysis />
      ) : currentPage === "search" ? (
        <Search />
      ) : (
        <>
          <NumberBar searchDate={null} />
          <Record isAddIcon={true} />
        </>
      )}
    </>}
      
      <Footer />
    </div>
  );
};

export default Home;