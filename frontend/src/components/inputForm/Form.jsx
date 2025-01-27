import React, { useState, useRef, useContext, useEffect } from 'react';
import './form.css'; 
import { StoreContext } from '../../context/context';
import axios from "axios";
import lamejs from 'lamejs';
import { toast } from "react-toastify";

const Form = ({ isIncome }) => {
  const { userData, records, fetchRecords } = useContext(StoreContext);

  const [data, setData] = useState({
    reason: "",
    amount: 0,
    type: "Cash",
    person: "",
    mobile: "",
  });
  const [image, setImage] = useState();
  const [audio, setAudio] = useState();
  const [audioUrl, setAudioUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isDefault, setIsDefault] = useState(false); 
  const mediaRecorderRef = useRef(null); 
  const audioChunksRef = useRef([]);

  const startRecording = () => {
    if (isRecording) {
      // Stop Recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      // Start Recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = []; // Reset audio chunks

          mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
          };

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
            const mp3Blob = await convertToMP3(audioBlob);
            const mp3Url = URL.createObjectURL(mp3Blob);
            setAudioUrl(mp3Url);
          };

          mediaRecorder.start();
          setIsRecording(true);
        })
        .catch((error) => {
          console.error("Error accessing media devices.", error);
        });
    }
  };

  

  const handleDeleteAudio = () => {
    setAudioUrl(''); 
    setAudio(null);
  };

  const handleCheckboxChange = (event) => {
    setIsDefault(event.target.checked); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };
  
  const convertToMP3 = async (audioBlob) => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    let wavBuffer = new Uint8Array(arrayBuffer);
  
    // Ensure the byte length is a multiple of 2
    if (wavBuffer.byteLength % 2 !== 0) {
      const paddedBuffer = new Uint8Array(wavBuffer.byteLength + 1);
      paddedBuffer.set(wavBuffer);
      wavBuffer = paddedBuffer;
    }
  
    const samples = new Int16Array(wavBuffer.buffer);
  
    // Convert WAV to MP3 using lamejs
    const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128); // Mono, 44.1kHz, 128kbps
    const mp3Data = [];
    let offset = 0;
    const chunkSize = 1152; // MP3 frame size
    while (offset < samples.length) {
      const sampleChunk = samples.subarray(offset, offset + chunkSize);
      const mp3Buffer = mp3Encoder.encodeBuffer(sampleChunk);
      if (mp3Buffer.length > 0) {
        mp3Data.push(mp3Buffer);
      }
      offset += chunkSize;
    }
  
    const flushBuffer = mp3Encoder.flush();
    if (flushBuffer.length > 0) {
      mp3Data.push(flushBuffer);
    }
  
    return new Blob(mp3Data, { type: "audio/mp3" });
  };
  
  

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("user_id", userData._id);
    formData.append("reason", data.reason);
    formData.append("amount", data.amount);
    formData.append("type", data.type);
    formData.append("person", data.person);
    formData.append("mobile", data.mobile);
    formData.append("isDefault", isDefault);
    formData.append("catagory", isIncome ? "income" : "expense");

    if (image) {
      formData.append("image", image);
    }
    if (audio) {
      formData.append("audio", audio);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
      },
      });
      if (response.data.success) {
        toast.success(`${isIncome ? "Income " : "Expense "}Successfully Uploaded!`);
        setData({
          reason: "",
          amount: 0,
          type: "Cash",
          person: "",
          mobile: "",
        });
        setImage(null);
        setAudio(null);
        setAudioUrl("");
         document.getElementById("image").value = "";
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
  
  
  useEffect(()=>{
    fetchRecords();
  },[]);

  const handleDropdown = (e)=>{
      const reason = e.target.value;
     
      if(reason!==""){
        const filterd = records.find(record =>record.reason === reason);
       
        if(filterd){
         setData({
           reason: filterd.reason,
           amount: filterd.amount,
           type:   filterd.type,
           person: filterd.person,
           mobile: filterd.mobile,
         })
        }
      }else{
        setData({
          reason: "",
          amount: 0,
          type: "Cash",
          person: "",
          mobile: "",
        });
      }
  }


  return (
    <div className="container">
      <form id="detailsForm" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="reason">New Reason *</label>
          <input type="text" id="reason" name="reason" required onChange={handleInputChange} value={data.reason} />
        </div>
        <div className="form-group">
          <label htmlFor="default-reason">Default Reason</label>
          <select id="default-reason" onChange={handleDropdown} name="default-reason" >
            <option value="" >Select a reason</option>
            {!!records && records.map((record,index)=>{
              return <option key={index} value={record.reason} >{record.reason}</option>          
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input type="number" id="amount" name="amount" required onChange={handleInputChange} value={data.amount} />
        </div>
        <div className="form-group">
          <label>Type *</label>
          <div className="radio-group">
            <label>
              <input type="radio" id="cash" name="type" onChange={handleInputChange} value="Cash" required />
              <span className="radio-label">Cash</span>
            </label>
            <label>
              <input type="radio" id="gpay" name="type" onChange={handleInputChange} value="Gpay" required />
              <span className="radio-label">Gpay</span>
            </label>
            <label>
              <input type="radio" id="loan" name="type" onChange={handleInputChange} value="Loan" required />
              <span className="radio-label">Loan</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="person">Person</label>
          <input type="text" id="person" name="person" onChange={handleInputChange} value={data.person} />
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input type="text" id="mobile" name="mobile" onChange={handleInputChange} value={data.mobile} />
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label>Record Voice</label>
          <button
            type="button"
            className={`record-btn ${isRecording ? 'recording' : ''}`}
            onClick={startRecording}
          ></button>
          {!!audioUrl && (
            <div className="audio-panel">
              <audio controls src={audioUrl} className="audio-player"></audio>
              <button type="button" className="delete-btn" onClick={handleDeleteAudio}></button>
            </div>
          )}
        </div>
        <div className="form-group checkbox-group">
          <button type="submit" className="submit-btn">Submit</button>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={handleCheckboxChange}
            />
            <p className="checkbox-label">Set as Default</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
