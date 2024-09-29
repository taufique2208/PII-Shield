import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Aadhaar from "../contracts/Aadhaar.json";
// import './User.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";

const User = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [userEvents, setUserEvents] = useState([]);

  // const [pending,set]
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      Aadhaar.abi,
      signer
    );
    setContract(contract);

    const getEvents = async () => {
      try {
        const events = await contract.queryFilter(
          contract.filters.userNotification(),
          0,
          "latest"
        );
        // console.log("account:", localStorage.getItem("account"));
        events.forEach((event) => {
          console.log("Event:", event);
          if (
            event.args[2].toString().trim().toLowerCase() ===
            localStorage.getItem("account").toString().trim().toLowerCase()
          ) {
            setUserEvents([...userEvents, event]);
          }
        });
      } catch (error) {
        console.log("Error fetching events:", error);
      }
    };
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
    name: "",
    dob: "",
    address: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contract.createUserDocuments(
        formData.name,
        formData.dob,
        formData.address,
        formData.gender
      );
      console.log("User data submitted successfully");
    } catch (error) {
      console.log("Error submitting user data:", error);
    }
  };

  const handleApprove = async (id, companyAddress) => {
    if (id === "Name") {
      await contract.grantAccessName(companyAddress);
      console.log("Access granted for name");
    }
    if (id === "Home Address") {
      await contract.grantAccessHomeAddress(companyAddress);
      console.log("Access granted for name");
    }
    if (id === "DOB") {
      await contract.grantAccessDOB(companyAddress);
      console.log("Access granted for name");
    }
    if (id === "Gender") {
      await contract.grantAccessGender(companyAddress);
      console.log("Access granted for name");
    }
  };

  return (
    <div className="p-10">
      {!account ? (
        // <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        //   <div className="text-center">
        //     <h2 className="text-white mb-4 text-2xl">
        //       Please connect a wallet that belongs to you, the User/Client.
        //     </h2>
        //     <button
        //       onClick={connectWallet}
        //       className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-lg"
        //     >
        //       Connect Your Wallet
        //     </button>
        //   </div>
        // </div>
        <ConnectButton></ConnectButton>
      ) : (
        <div className="flex flex-col items-center">
          {/* <div> */}
          <h2 className="text-2xl font-bold mb-6">User Form</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-2">
              <span>Name</span>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="grow"
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span>Date of Birth</span>
              <input
                type="date"
                name="dob"
                id="dob"
                value={formData.dob}
                onChange={handleChange}
                className="grow"
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span>Address</span>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="grow"
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span>Gender</span>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="grow"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <button type="submit" className="btn btn-primary w-full">
              Submit
            </button>
          </form>
          {/* </div> */}

          <div className="mt-10 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Event List</h2>
            <ul className="space-y-2">
              {userEvents.map((event) => (
                <li
                  key={event.address}
                  className="event-item flex justify-between items-center p-2 border border-gray-300 rounded-md"
                >
                  <span>{event.args[0]}</span>
                  {/* <span>{event.name}</span> */}

                  <button
                    onClick={() => handleApprove(event.args[0], event.args[1])}
                    className="approve-button btn btn-secondary"
                  >
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
