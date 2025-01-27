import React, { useContext, useMemo } from 'react';
import './numberbar.css'; 
import { StoreContext } from '../../context/context';

const NumberBar = () => {
    const { records } = useContext(StoreContext);
    console.log(records);

    const { income, expense } = useMemo(() => {
        let income = 0;
        let expense = 0;

        records.forEach((record) => {
            if (record.catagory === "income") {
                income += record.amount;
            } else {
                expense += record.amount;
            }
        });

        return { income, expense };
    }, [records]); // Recalculates only when `records` change.

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
