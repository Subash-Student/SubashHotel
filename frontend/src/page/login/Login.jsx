import React, { useContext, useState } from 'react';
import axios from "axios";
import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"
import { StoreContext } from "../../context/context.js";
import './login.css'; 

const LogIn = () => {

    const{setToken} = useContext(StoreContext);
    
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit =async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("subash-hotel-backend.vercel.app/api/login",formData);
            if(response.data.success){
                localStorage.setItem("token",response.data.token)
                toast.success(response.data.message);
                setToken(response.data.token);
                setFormData({
                    userName: '',
                    password: ''
                })
                 navigate("/")
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed To LogIn");   
        }


    };

    return (
        <div className="body2">
        <div className="login-container">
            <div className="header1">
                
                <img src="chef-logo2.png" alt="Save My Money Logo" className="logo1" />
                
                <a href="https://fontmeme.com/tamil/"><img className='app-img2' src="https://fontmeme.com/permalink/250203/0d83dd16f58de88dabc23564dd57d416.png" alt="tamil" border="0"/></a>
            </div>

           
            <h2 className="login-heading">Login</h2>

            
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="mobile">User Name</label>
                <input
                    type="text"
                    id="mobile"
                    name="userName"
                    placeholder="Mobile/Email"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                />
                
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                
                <button type="submit">Login</button>
                
                {/* <p>New ? <span onClick={()=>navigate("/register")}>Register</span></p> */}
               
            </form>
        </div>
        </div>
    );
};

export default LogIn;
