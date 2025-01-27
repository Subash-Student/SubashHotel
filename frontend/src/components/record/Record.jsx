import React, { useContext, useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom"
import "./record.css"; 
import { StoreContext } from '../../context/context';


const Record = () => {
    const [activeRecord, setActiveRecord] = useState(null);
    const navigate = useNavigate();
   const {records,fetchRecords} = useContext(StoreContext);

   useEffect(()=>{
    fetchRecords()
   },[]);

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
                  <p className="contact">{`${record.person} | ${record.mobile}`}</p>
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
