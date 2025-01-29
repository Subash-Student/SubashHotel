import React, { useContext, useState } from 'react';
import "./record.css"; 
import axios from "axios"
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { StoreContext } from '../../context/context';
import AddDetails from '../addDetails/AddDetails.jsx';
import { BsThreeDotsVertical, BsFillVolumeUpFill } from "react-icons/bs";
import PopupModal from '../popuModel/PopupModal.jsx';



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
    throw new Error(error.response?.data?.message || "Failed to fetch records data!");
  }
};


const Record = () => {

  const [isImage, setIsImage] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [showPopupModal, setShowPopupModal] = useState(false);
  
    const [activeRecord, setActiveRecord] = useState(null);
    const [showModal, setShowModal] = useState(null);
    
    const { isOpen, token, setRecords,setIsOpen } = useContext(StoreContext);

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
    
    if(records){
      setRecords(records)
    }
    // Loading state
    if (isLoading) {
      return <h1>Loading...</h1>;
    }
  
    // Error state
    if (isError) {
      return <h1>Error: {error.message}</h1>; // Safely display the error message
    }
  
    const openImageModal = () => {
      setIsImage(true);
      setIsAudio(false);
      setShowPopupModal(true);
    };
  
    const openAudioModal = () => {
      setIsAudio(true);
      setIsImage(false);
      setShowPopupModal(true);
    };
  
    // Close the modal
    const closeModal = () => {
      setShowPopupModal(false);
    };





    return (
        <div id="body">
  <div className="header3">Records</div>
  <hr className="divider" />

  <div className="record-list">
  {records
        ?.filter(record => record.createdAt.split("T")[0] === new Date().toISOString().split("T")[0])
        .map((record, key) => (
          <div 
            className={`detail-item ${activeRecord === key ? "active" : ""}`} 
            key={key} 
            onClick={() =>{
              setActiveRecord(activeRecord === key ? null : key);
              setImageUrl(record.image);
              setAudioUrl(record.audio)
               } }
          >

            {/* Show Three Dots Only When Active */}
            {activeRecord === key && (
              <div className="three-dots" onClick={(e) => { 
                e.stopPropagation();
                setShowModal(showModal === key ? null : key);
              }}>
                <BsThreeDotsVertical size={18} />
              </div>
            )}

            {/* Image */}
            <div className="image-container">
              <img
                src="https://static.thenounproject.com/png/1123247-200.png"
                alt="Attachment"
              />
            </div>

            <div className="detail-content">
              <p className="details">{record.reason}</p>

              {activeRecord === key && (
                <div>
                  {record.person && (
                    <p className="contact">{`${record.person} | ${record.mobile || ""}`}</p>
                  )}
                  <p className="date-time">
                    {`Date: ${record.createdAt.split("T")[0]} | ${new Date(record.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}`}
                  </p>
                  <div className="file-info">
                    <img onClick={openImageModal} src={record.image} alt="File Attachment" />
                    <p onClick={openImageModal}>Attachments</p>
                  </div>
                </div>
              )}
            </div>

            {/* Speaker Icon - Parallel Between Image & Amount */}
            {activeRecord === key && (
              <div className="speaker-icon">
                <BsFillVolumeUpFill size={16} onClick={openAudioModal} color="#A0A0A0" />
              </div>
            )}

            {/* Amount - Moves to Bottom Right when Active */}
            <div 
              className={record.catagory === "expense" ? "amount expense" : "amount"} 
              style={{ position: activeRecord === key ? "absolute" : "static", bottom: activeRecord === key ? "10px" : "auto", right: activeRecord === key ? "10px" : "auto" }}
            >
              ₹ {record.amount}
            </div>

            {/* Modal for Three Dots */}
            {showModal === key && (
              <div className="modal">
                <div className="modal-content">
                  <button onClick={() => console.log("Edit Record")}>Edit</button>
                  <button onClick={() => console.log("Delete Record")}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
  </div>

  <button className="add-button" onClick={() =>setIsOpen(true) }>+</button>
  {isOpen &&
   <AddDetails />
  }
    {showPopupModal && (
        <PopupModal
          isImage={isImage}
          isAudio={isAudio}
          imageUrl={imageUrl}
          audioUrl={audioUrl}
          closeModal={closeModal}
        />
      )}
</div>
    
    );
};

export default Record;
