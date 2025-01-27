import React, { useContext, useState } from 'react';
import './footer.css';
import { StoreContext } from '../../context/context';

const Footer = () => {

    const{setCurrentPage} = useContext(StoreContext);


    return (
        <div className="footer">
            <div className="footer-item" onClick={()=>{setCurrentPage("record")}}>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/124/124050.png"
                    alt="Record"
                    className="footer-icon"
                    
                />
                <p className="footer-text">Record</p>
            </div>
            <div className="footer-item"  onClick={()=>{setCurrentPage("analysis")}}>
                <img
                    src="https://thumb.ac-illust.com/b0/b0c8e11d357c580d458f018067e094e1_t.jpeg"
                    alt="Analysis"
                    className="footer-icon"
                   
                />
                <p className="footer-text">Analysis</p>
            </div>
            <div className="footer-item" onClick={()=>{setCurrentPage("search")}}>
                <img
                    src="https://img.icons8.com/color/512/search.png"
                    alt="Search"
                    className="footer-icon"
                    
                />
                <p className="footer-text">Search</p>
            </div>
        </div>
    );
};

export default Footer;
