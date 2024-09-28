import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import Aadhaar from '../contracts/Aadhaar.json'
import './User.css';

const User = () => {

    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [userEvents, setUserEvents] = useState([]);

    // const [pending,set]
    useEffect(() => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();


        const contract = new ethers.Contract(
            '0x62C158c7F4326067DaF185F39EC66481477a1598',
            Aadhaar.abi,
            signer
        );
        setContract(contract);
        
        const getEvents = async () => {
            try {
                const events = await contract.queryFilter(contract.filters.userNotification(), 0, 'latest');
                // console.log("account:", localStorage.getItem("account"));
                events.forEach(event => {
                    console.log("Event:", event);
                    if (event.args[2].toString().trim().toLowerCase() === localStorage.getItem("account").toString().trim().toLowerCase()) {
                        setUserEvents([...userEvents, event]);
                    }
                });
            } catch (error) {
                console.log("Error fetching events:", error);
            }

        }
        getEvents();

    }, []);

    // useEffect(() => {

    //     const getEvents = async () => {
    //         try {
    //             const events = await contract.queryFilter(contract.filters.userNotification(), 0, 'latest');
    //             console.log("Events:", events);
    //             events.forEach(event => {
    //                 if (event.args[2] == account) {
    //                     setUserEvents([...userEvents, event]);
    //                 }
    //             });
    //         } catch (error) {
    //             console.log("Error fetching events:", error);
    //         }

    //     }
    //     getEvents();
    // }, [contract, account]);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                console.log("Connected:", accounts[0]);
                setAccount(accounts[0]);
                localStorage.setItem("account", accounts[0]);

            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
            }
        } else {
            alert(
                "MetaMask is not installed. Please install MetaMask and try again."
            );
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        address: '',
        gender: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await contract.createUserDocuments(formData.name, formData.dob, formData.address, formData.gender);
            console.log("User data submitted successfully");
        } catch (error) {
            console.log("Error submitting user data:", error);
        }
    };

    const handleApprove = async (id,companyAddress) => {
        if(id === 'name'){
            await contract.grantAccessName(companyAddress);
            console.log("Access granted for name");
        }
    }

    return (
        <div>

            {!account ?
                <button onClick={connectWallet} className="wallet-connect-btn">Chal Wallet Connect Kar</button>

                :
                <>
                    <h2>User Form</h2>
                    <form onSubmit={handleSubmit} className="user-form">
                        <div className="form-group">
                            <label for="name">Name:</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label for="dob">Date of Birth:</label>
                            <input
                                type="date"
                                name="dob"
                                id="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label for="address">Address:</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label for="gender">Gender:</label>
                            <select
                                name="gender"
                                id="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>



                    <div className="event-list">
                        <h2>Event List</h2>
                        
                        <ul>
                            {userEvents.map(event => (
                                
                                <li key={event.address} className="event-item">
                                    {/* <h1>hi</h1> */}
                                    <span>{event.args[0]}</span>
                                    <button onClick={() => handleApprove(event.args[0],event.args[1])} className="approve-button">
                                        Approve
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                </>
            }


        </div>

    );
}

export default User