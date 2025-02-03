import React, { useContext, useState, useEffect } from 'react';
import "./record.css"; 
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from '../../context/context';
import AddDetails from '../addDetails/AddDetails.jsx';
import { BsThreeDotsVertical, BsFillVolumeUpFill } from "react-icons/bs";
import PopupModal from '../popuModel/PopupModal.jsx';

const Record = ({isAddIcon}) => {
  const [activeRecord, setActiveRecord] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [showPopupModal, setShowPopupModal] = useState(false);

  const { isOpen, token, searchDate, setIsOpen, setRecords,fetchRecords, queryClient,records,setIsLoading } = useContext(StoreContext);
  // const [records, setRecordsData] = useState([]);

  useEffect(() => {
    if (token && searchDate) {
      // Fetch data only if token and date are available
      fetchRecords();
    }
  }, [token, searchDate]); // Trigger when token or date changes

  

  // Handle delete record
  const handleDelete = async (recordId) => {
    try {
      setIsLoading(true)
      const response = await axios.delete(`http://localhost:5000/api/delete-record/${recordId}`, {
        headers: { token },
        withCredentials: true,
      });
      setIsLoading(false)
      if (response.data.success) {
        toast.success(response.data.message);
        setRecords((prevRecords) => prevRecords.filter(record => record._id !== recordId));
        setShowModal(null);
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Open modal for image/audio
  const openModal = (type, url) => {
    setIsImage(type === "image");
    setIsAudio(type === "audio");
    setMediaUrl(url);
    setShowPopupModal(true);
  };

  return (
    <div id="body">
      <div className="header3">பதிவுகள்</div>
      <hr className="divider" />
  
      <div className="record-list">
        {records?.filter(record => record.createdAt.split("T")[0] === searchDate).length === 0 ? (
          // Show this image when there are no records
          <div className="no-records">
            <img src="no-data-img.png" className='no-data-img' alt="No Records Found" />
            
          </div>
        ) : (
          records?.filter(record => record.createdAt.split("T")[0] === searchDate)
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
                      <p className="date-time">{`தேதி: ${record.createdAt.split("T")[0]} | ${new Date(record.createdAt).toLocaleTimeString()}`}</p>
                      <div className="file-info">
                        {record.image && <img onClick={() => openModal("image", record.image)} src={record.image} alt="File" />}
                        {record.image || record.audio ? <p onClick={() => openModal("image", record.image)}>Attachments</p> : ""}
                      </div>
                      {record.audio &&
                      <div className="speaker-icon">
                        <BsFillVolumeUpFill size={16} onClick={() => openModal("audio", record.audio)} color="#A0A0A0" />
                      </div>}
                    </div>
                  )}
                </div>
  
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
            ))
        )}
      </div>
  
      {isAddIcon && <button className="add-button" onClick={() => setIsOpen(true)}>+</button>}
      
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
