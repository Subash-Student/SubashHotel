import React, { useContext, useState } from 'react';
import "./record.css"; 
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { StoreContext } from '../../context/context';
import AddDetails from '../addDetails/AddDetails.jsx';
import { BsThreeDotsVertical, BsFillVolumeUpFill } from "react-icons/bs";
import PopupModal from '../popuModel/PopupModal.jsx';




const Record = () => {
  const [activeRecord, setActiveRecord] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [showPopupModal, setShowPopupModal] = useState(false);

  const { isOpen, token, setIsOpen,setRecords ,queryClient} = useContext(StoreContext);

  const { data: records = [], isLoading, isError, error } = useQuery({
    queryKey: ["records", token],
    queryFn: () => fetchRecordsData(token),
    enabled: !!token,
    onError: (err) => toast.error(err.message || "An error occurred"),
  });

  const fetchRecordsData = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-records", {
        headers: { token },
        withCredentials: true,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setRecords(response.data.records)
      return response.data.records;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch records data!");
    }
  };


  const openModal = (type, url) => {
    setIsImage(type === "image");
    setIsAudio(type === "audio");
    setMediaUrl(url);
    setShowPopupModal(true);
  };

  const handleDelete = async (recordId) => {

    try {
      const response = await axios.delete(`http://localhost:5000/api/delete-record/${recordId}`, {
        headers: { token },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        queryClient.invalidateQueries(["records"]); // Refresh records after deletion
        setRecords(prevRecords => prevRecords.filter(record => record._id !== recordId));
        setShowModal(null);
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error: {error.message}</h1>;

  return (
    <div id="body">
      <div className="header3">Records</div>
      <hr className="divider" />

      <div className="record-list">
        {records?.filter(record => record.createdAt.split("T")[0] === new Date().toISOString().split("T")[0])
          .map((record, key) => (
            <div 
              className={`detail-item ${activeRecord === key ? "active" : ""}`} 
              key={key} 
              onClick={() => setActiveRecord(activeRecord === key ? null : key)}
            >
              {activeRecord === key && (
                <div className="three-dots" onClick={(e) => { 
                  e.stopPropagation();
                  setShowModal(showModal === key ? null : key);
                }}>
                  <BsThreeDotsVertical size={18} />
                </div>
              )}

              <div className="image-container">
                <img src="https://static.thenounproject.com/png/1123247-200.png" alt="Attachment" />
              </div>

              <div className="detail-content">
                <p className="details">{record.reason}</p>
                {activeRecord === key && (
                  <div>
                    {record.person && (
                      <p className="contact">{`${record.person} | ${record.mobile || ""}`}</p>
                    )}
                    <p className="date-time">{`Date: ${record.createdAt.split("T")[0]} | ${new Date(record.createdAt).toLocaleTimeString()}`}</p>
                    <div className="file-info">
                      {record.image && <img onClick={() => openModal("image", record.image)} src={record.image} alt="File" />}
                      <p onClick={() => openModal("image", record.image)}>Attachments</p>
                    </div>
                  </div>
                )}
              </div>

              {activeRecord === key && (
                <div className="speaker-icon">
                  <BsFillVolumeUpFill size={16} onClick={() => openModal("audio", record.audio)} color="#A0A0A0" />
                </div>
              )}

              <div className={record.catagory === "expense" ? "amount expense" : "amount"}>
                ₹ {record.amount}
              </div>

              {showModal === key && (
                <div className="modal">
                  <div className="modal-content">
                    <button onClick={() => handleDelete(record._id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      <button className="add-button" onClick={() => setIsOpen(true)}>+</button>
      {isOpen && <AddDetails />}

      {showPopupModal && (
        <PopupModal
          isImage={isImage}
          isAudio={isAudio}
          mediaUrl={mediaUrl}
          closeModal={() => setShowPopupModal(false)}
        />
      )}
    </div>
  );
};

export default Record;
