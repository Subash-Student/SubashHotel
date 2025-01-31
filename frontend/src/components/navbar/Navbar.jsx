import React from "react";
import './navbar.css';
import { IoMdExit } from "react-icons/io";

const Navbar = () => {
  
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
      <div className="nav" >
      <nav className="navbar">
        <div className="logo">
          <img
            src="https://www.thegreatapps.com/application/upload/Apps/2017/03/expense-manager-22.png"
            alt="App Logo"
          />
          <span className="app-name">Save My Money</span>
        </div>
        <IoMdExit className="exitIcon"/>
      </nav>

      
      <div className="date-bar">
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default Navbar;
