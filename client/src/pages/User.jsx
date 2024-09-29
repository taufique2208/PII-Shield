import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Aadhaar from "../contracts/Aadhaar.json";
// import './User.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Navbar from "../components/Navbar";


const User = () => {
  const [contract, setContract] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const {isConnected, address} = useAccount()
  const [loading, setLoading] = useState(false);

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
      setLoading(true)
      try {
        const events = await contract.getAllEvents();

        for(let i=0; i<events.length; i++){
          if(events[i][3].toString().trim().toLowerCase() === "pending"){
            setUserEvents((prevEvents) => [...prevEvents, events[i]]);
          }
        }
        console.log(events);
      } catch (error) {
        console.log("Error fetching events:", error);
      }finally{
        setLoading(false) 
      }
    };
    getEvents();
  }, []);

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
    setLoading(true)
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
    }finally{
      setLoading(false)
    }
  };

  const handleApprove = async (id, companyAddress) => {
    setLoading(true)
    try{
      if (id === "name") {
        await contract.grantAccessName(companyAddress);
        console.log("Access granted for name");
      }
      if (id === "HomeAddress") {
        await contract.grantAccessHomeAddress(companyAddress);
        console.log("Access granted for home address");
      }
      if (id === "DOB") {
        await contract.grantAccessDOB(companyAddress);
        console.log("Access granted for DOB");
      }
      if (id === "Gender") {
        await contract.grantAccessGender(companyAddress);
        console.log("Access granted for Gender");
      }
    }catch(error){
      console.log("Error approving data:", error);
    }finally{
      setLoading(false) 
    }

  };

  if (loading) {
    return (
      <div>
        <span className="loading loading-dots loading-md"></span>
      </div>
    );
  }

  return (
    <div className="">
      <Navbar/>
      {!isConnected ? (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="card lg:card-side bg-base-100 shadow-2xl m-10 max-w-6xl h-[400px]">
          <figure>
            <img
              src="https://www.goanywhere.com/sites/default/files/2024-08/ga-guard-pii-with-threat-protection-1200x628.png"
              className="h-full w-96 object-cover"
              alt="Album"
            />
          </figure>
          <div className="card-body pl-10">
            <h2 className="card-title text-4xl font-bold">Connect Your Wallet</h2>
            <p className="text-lg text-gray-600">
              Easily connect using various wallet providers and start interacting with our platform.
            </p>
            <div className="card-actions justify-end mt-6">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
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
          <button
            onClick={() => {
              console.log(address);
            }}
          >
          
          </button>
          {/* </div> */}

          <div className="mt-10 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Event List</h2>
            <ul className="space-y-2">
              {userEvents.map((event,id) => (
                <li
                  key={id}
                  className="event-item flex justify-between items-center p-2 border border-gray-300 rounded-md"
                >
                  <span>{event[2]}</span>
                  <span>company: {event[0]}</span>
                  {/* <span>{event.name}</span> */}

                  <button
                    onClick={() => handleApprove(event[2], event[1].toString().trim())}
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
