import React, { useContext } from "react";
import './navbar.css';
import { IoMdExit } from "react-icons/io";
import { StoreContext } from "../../context/context";

const Navbar = () => {
  const { searchDate, setToken,currentPage } = useContext(StoreContext);

  const today = new Date();
  const options = { year: 'numeric', day: 'numeric' };
  
  // Custom mapping of English months to Tamil months
  const tamilMonths = [
    'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 
    'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
  ];
  
  const month = today.getMonth();  // Get the current month (0-11)
  const tamilMonth = tamilMonths[month];
  
  const formattedDate = `${today.getDate()} ${tamilMonth} ${today.getFullYear()}`;

  // Function to format the searchDate
  const formatSearchDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const tamilMonthForSearchDate = tamilMonths[parseInt(month) - 1];  // Convert month from numeric to Tamil
    return `${parseInt(day)} ${tamilMonthForSearchDate} ${year}`;  // Remove leading 0 from day
  };
const logOut = ()=>{
  localStorage.removeItem("token");
  setToken(null)
}
  return (
    <div className="nav">
      <nav className="navbar">
        <div className="logo">
          <img
            className="logo-img"
            src="chef-logo2.png"
            alt="App Logo"
          />
          {/* <span className="app-name">சுபாஷ் ஹோட்டல்</span> */}
          <a href="https://fontmeme.com/tamil/">
            <img
              className="app-img"
              src="https://fontmeme.com/permalink/250203/7cd43605c8bd292cb7f013e27646eb29.png"
              alt="tamil"
              border="0"
            />
          </a>
        </div>
        <IoMdExit onClick={logOut} className="exitIcon" />
      </nav>

      <div className="date-bar">
        <span>{currentPage === "search" ? formatSearchDate(searchDate) : formattedDate}</span>
      </div>
    </div>
  );
};

export default Navbar;
