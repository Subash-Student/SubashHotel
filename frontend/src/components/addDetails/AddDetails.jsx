import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './add.css'; 
import Form from '../inputForm/Form';

const AddDetails = () => {

  const [isIncome,setIsIncome] = useState(false);

  const handelCatagory = ()=>{
    setIsIncome(prev=>!prev);
  }

  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="header">
        <img src="https://static-00.iconduck.com/assets.00/go-back-icon-512x512-hqhqt5j0.png" alt="" onClick={() => navigate("/")} />
        <h1>Add</h1>
      </div>
      <div className="catagory">
        <div className={isIncome ? "income-current" :"income"} onClick={handelCatagory}>Income</div>
        <div className={!isIncome ? "expense-current":"expense"} onClick={handelCatagory}>Expense</div>
      </div>
      <div className="addDetails">
        <Form isIncome={isIncome}/>
      </div>
      
    </div>
  );
};

export default AddDetails;
