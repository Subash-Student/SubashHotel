import React, { useContext, useState } from "react";
import "./add.css"
import axios from "axios"
import { toast } from "react-toastify";
import { useReactMediaRecorder } from "react-media-recorder";
import { StoreContext } from '../../context/context';
import { FaMicrophone, FaTrashAlt } from "react-icons/fa";


const AddDetails = () => {
  const { isOpen,userData, token,setIsOpen ,queryClient} = useContext(StoreContext);

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [currentType,setCurrentType] = useState("expense");
  const [image,setImage] = useState(null);
  const [data,setData] = useState({
    reason:"",
    amount:"",
    type:"Cash",
    person:"",
    mobile:"",
    isDefault:false,
    isFromIncome:false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    if(event.target.checked) {
      setData({ ...data, [event.target.name]: true });
    }else{
      setData({ ...data, [event.target.name]: false });
     
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };



  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);

  const handleStop = (blobUrl, blob) => {
    console.log("Blob URL:", blobUrl);
    console.log("Blob Object:", blob);
    setAudioURL(blobUrl); // Set the URL for playback
    setAudioBlob(blob);   // Save the Blob if needed for uploading
  };

  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    mediaRecorderOptions: { mimeType: "audio/webm" },
    onStop: handleStop, // Callback when recording stops
  });


  const handleDelete = () => {
    setAudioBlob(null);
    setAudioURL(null);
  };


  const onSubmit = async(e)=>{
    e.preventDefault();

    const formData = new FormData();

    for(let key in data){
      formData.append(`${key}`,data[key]);
    }
    
    formData.append("audio",audioBlob);
    formData.append("image",image);
    formData.append("catagory",currentType);
    try {
      const response = await axios.post("http://localhost:5000/api/add-record-details",formData,{
        headers: {
          token: token,
        },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          reason: "",
          amount: 0,
          type: "cash",
          person: "",
          mobile: "",
          isDefault:false,
          isFromIncome:false
        });
        setImage(null);
        setAudioBlob(null);
        setAudioURL(null);
        const image =  document.getElementById("image");
        if(image){image.value =""}
        queryClient.invalidateQueries(["records"]); // Refresh records after deletion

      } else {
       
        toast.error(response.data.message);
      }


    } catch (error) {
      console.log(error);
      toast.error(error.response ? error.response.data.message : error.message);
    }

  }


  const handleDropdown = (e)=>{
    const reason = e.target.value;
   
    if(reason!==""){
      const filterd = userData.defaultRecords.find(record =>record.reason === reason );
     
      if(filterd){
       setData({
         reason: filterd.reason,
         amount: filterd.amount,
         type:   filterd.type,
         person: filterd.person,
         mobile: filterd.mobile,
         isDefault:true,
         isFromIncome:filterd.isFromIncome
       })
      }
    }else{
      setData({
        reason: "",
        amount: 0,
        type: "cash",
        person: "",
        mobile: "",
      });
    }
}







  const handleToggleDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="popup-content">
          {/* Navbar */}
          <div className="popup-navbar">
            <button className={`popup-nav-button ${currentType === "income" ? "income":""}`} onClick={()=>setCurrentType("income")}>வரவு</button>
            <button className={`popup-nav-button ${currentType === "expense" ? "expense":""}`} onClick={()=>setCurrentType("expense")}>செலவு</button>
            <button onClick={()=>setIsOpen(false)} className="popup-close-button">
              X
            </button>
          </div>

          {/* Body */}
          <div className="popup-body">
            {/* Default Reasons Select */}
            <div className="form-group">
              <label className="form-label">தினசரி காரணங்கள்</label>
              <select className="form-input" value={data.reason} name="reason"onChange={handleDropdown}>
                <option value="">காரணங்கள்</option>
                {!!userData.defaultRecords && userData.defaultRecords.map((record,index)=>{
                  if(record.catagory === currentType){
                    return <option key={index} value={record.reason} >{record.reason}</option>          
                  }
                })
                }
              </select>
            </div>

            {/* Custom Reason Input */}
            <div className="form-group">
              <label className="form-label">காரணம்</label>
              <input
              value={data.reason}
                type="text"
                placeholder="Enter your reason"
                className="form-input"
                name="reason"
                onChange={handleInputChange}
              />
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label className="form-label">தொகை</label>
              <input
              value={data.amount}
                type="number"
                placeholder="Enter amount"
                className="form-input"
                name="amount"
                onChange={handleInputChange}
              />
            </div>

            {/* Payment Options and Checkboxes */}
            <div className="form-group">
              <label className="form-label">பணம் செலுத்தும் முறை</label>
              <div className="payment-options">
                <label>
                  <input type="radio" name="type" value="cash" onChange={handleInputChange} checked={data.type === "cash"}  /> பணம்
                </label>
                <label>
                  <input type="radio" name="type" value="gpay" onChange={handleInputChange} checked={data.type === "gpay"} /> வங்கி கணக்கு
                </label>
              </div>
              <label className="form-label">மற்றவை</label>
             
              <div className="action-row">
                
                <div className="form-checkbox-group">
                  <div className="form-checkbox">
                    <input type="checkbox"  name="isDefault" onClick={handleCheckboxChange} checked={data.isDefault} id="make-default" />
                    <label htmlFor="make-default" className="font">தினசரி காரணமா?</label>
                  </div>
                  {currentType === "expense" && <>
                  <div className="form-checkbox">
                  <input type="checkbox"  name="isFromIncome" onClick={handleCheckboxChange} checked={data.isFromIncome} id="make-default" />
                  <label htmlFor="make-default" className="font">இது வருமானத்திலிருந்து?</label>
                </div>
                  </>
                  }
                </div>

              </div>
            </div>
            <div className="image-container">
            <img
                src="https://static.thenounproject.com/png/1123247-200.png"
                alt="Attachment"
              
              />
            <button onClick={handleToggleDetails} className="more-details">
            மேலும் 
                </button>
            </div>
            {/* Additional Details */}
            {showMoreDetails && (
              <div className="more-details-content">
                <div className="form-group">
                  <label className="form-label">நபர் பெயர்</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="form-input"
                    name="person"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">மொபைல் எண்</label>
                  <input
                    type="tel"
                    placeholder="Enter mobile"
                    className="form-input"
                    name="mobile"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">படத்தை பதிவேற்றவும்</label>
                  <input type="file" id="image" onChange={handleFileChange} className="form-input" />
                </div>


                <div className="form-group">
      <label className="form-label">குரல் பதிவு</label>

      <div className="recording-controls">
        {status !== "recording" &&
        (<button
          className={`record-button ${status === "recording" ? "recording" : ""}`}
          onClick={startRecording}
          disabled={status === "recording"}
        >
          <FaMicrophone className="mic-icon" />
          {status === "recording" ? "பதிவு செய்கிறது......" : "பதிவு செய்"}
        </button>)
        }

        {status === "recording" && (
          <button className="record-button recording" onClick={stopRecording}>
          <FaMicrophone className="mic-icon" />

          நிறுத்து
          </button>
        )}
      </div>

      {audioBlob && (
        <div className="audio-player-container">
          <audio controls>
            <source src={audioURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <button className="trash-button" onClick={handleDelete}>
            <FaTrashAlt />
          </button>
        </div>
      )}
    </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="popup-footer">
            <button className="submit-button" onClick={onSubmit}>சமர்ப்பிக்கவும்</button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddDetails;
