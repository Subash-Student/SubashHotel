import React, { useContext, useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom"
import "./record.css"; 
import axios from "axios"
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { StoreContext } from '../../context/context';



const fetchRecordsData = async (token) => {
  try {
    const response = await axios.get("http://localhost:5000/api/get-records", {
      headers: {
        token: token,
      },
      withCredentials: true,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.records; // Return the records array
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user data!");
  }
};


const Record = () => {

  
    const [activeRecord, setActiveRecord] = useState(null);
    const navigate = useNavigate();
    const {  token, setRecords } = useContext(StoreContext);

    const { data: records, isLoading, isError, error } = useQuery({
      queryKey: ["records", token], // Unique query key
      queryFn: () => fetchRecordsData(token), // Pass the query function properly
      enabled: !!token, // Ensure token exists before running the query
      onSuccess: (data) => {
        setRecords(data); // Update user data in context
        toast.success("Records Fetched Successfully!");
      },
      onError: (err) => {
        toast.error(err.message || "An error occurred"); // Show error message
      },
    });
  
    // Loading state
    if (isLoading) {
      return <h1>Loading...</h1>;
    }
  
    // Error state
    if (isError) {
      return <h1>Error: {error.message}</h1>; // Safely display the error message
    }
  


    return (
        <div id="body">
  <div className="header3">Records</div>
  <hr className="divider" />

  <div className="record-list">
    {records ? 
      records.map((record, key) => {
        return (
          <div className="detail-item" key={key}>
            <div className="image-container">
              <img
                src="https://static.thenounproject.com/png/1123247-200.png"
                alt="Attachment"
                onClick={() => setActiveRecord(activeRecord === key ? null : key)}
              />
            </div>
            <div className="detail-content">
              <p className="details">{record.reason}</p>
              {activeRecord === key && (
                <div>
                  {record.person && <><p className="contact">{`${record.person ? record.person :""} | ${record.mobile?record.mobile:""}`}</p> </> }
                  <p className="date-time">
                    {`Date: ${record.createdAt.split("T")[0]} | ${new Date(record.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`}
                  </p>
                  <div className="file-info">
                    <img src={record.image} alt="File Attachment" />
                    <p>document.pdf</p>
                  </div>
                </div>
              )}
            </div>

            <div className={record.catagory === "expense" ? "amount expense" : "amount"}>₹ {record.amount}</div>
          </div>
        );
      })
    : (
      <p className="details">No Records!</p>
    )}
  </div>

  <button className="add-button" onClick={() => navigate("/addDetails")}>+</button>
</div>

    );
};

export default Record;
