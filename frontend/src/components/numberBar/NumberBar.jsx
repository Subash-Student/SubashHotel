import React, { useContext, useMemo } from 'react';
import './numberbar.css'; 
import { StoreContext } from '../../context/context';

const NumberBar = ({date}) => {
    const { records } = useContext(StoreContext);

    const { income, expense } = useMemo(() => {
        let income = 0;
        let expense = 0;
    
        if (records) {
            records.forEach((record) => {
                // Check if createdAt exists
                if (!record.createdAt) return;
    
                // Compare the date correctly (without time)
                if (record.createdAt.split("T")[0] !== (date ? date : new Date().toISOString().split("T")[0])) {
                    return;
                }
                
                // Check category and accumulate
                if (record.catagory === "income") {
                    income += record.amount;
                } else if (record.catagory === "expense") {
                    expense += record.amount;
                    if(record.isFromIncome){income+=record.amount}
                }
            });
        }
    
        return { income, expense };
    }, [records]);
    
    

    return (
        <div className="body3">
            <div className="bar-container">
                <div className="bar-section income">
                    <div className="value">₹{income}</div>
                </div>
                <div className="bar-section expense">
                    <div className="value">₹{expense}</div>
                </div>
                <div className="bar-section total">
                    <div className="value">₹{income - expense}</div>
                </div>
            </div>
        </div>
    );
};

export default NumberBar;
