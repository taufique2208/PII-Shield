import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import Aadhaar from "../contracts/Aadhaar.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navbar from "../components/Navbar";
import { useAccount } from "wagmi";

// import './Company.css'; // Import your CSS file for styling



const Company = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false)
  // const [account, setAccount] = useState("");
  const [data, setData] = useState({
    name: "",
    dob: "",
    HomeAddress: "",
    gender: "",
  });

  const account = useAccount()
  
  useEffect(() => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        // "0xf81e0D57Fe463b23559042eF7D0dc80A70eBf4dE",
        Aadhaar.abi,
        signer
      );
      console.log(contract)
      setContract(contract);
    } catch (error) {
      console.log("Error in connecting to contract:", error);
    }
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if(!contract || !id){
        console.log("apka insiitialised nahi hai babu");
        return;
      }
      try {
        console.log(id)
        const information = await contract.checkAllAccess(id);
        console.log(information);
        setData({
          name: information.name,
          dob: information.DOB,
          HomeAddress: information.HomeAddress,
          gender: information.gender,
        });
      } catch (error) {
        console.log('Error getting data:', error);
      }
    };
    // const getName = async () => {
    //   try {
    //     const name = await contract.retrieveName(id);
    //     setData((prevData) => ({ ...prevData, name }));
    //     console.log(name);
    //   } catch (error) {
    //     console.log("Error getting name:", error);
    //   }
    // };

    // const getDOB = async () => {
    //   try {
    //     const DOB = await contract.retrieveDOB(id);
    //     setData((prevData) => ({ ...prevData, DOB }));
    //     console.log(DOB);
    //   } catch (error) {
    //     console.log("Error getting name:", error);
    //   }
    // };

    // const getAddress = async () => {
    //   try {
    //     const address = await contract.retrieveHomeAddress(id);
    //     setData((prevData) => ({ ...prevData, address }));
    //     console.log(address);
    //   } catch (error) {
    //     console.log("Error getting name:", error);
    //   }
    // };

    // const getGender = async () => {
    //   try {
    //     const gender = await contract.retrieveGender(id);
    //     setData((prevData) => ({ ...prevData, gender }));
    //     console.log(gender);
    //   } catch (error) {
    //     console.log("Error getting name:", error);
    //   }
    // };

    if (contract && id) {
      // getName();
      // getDOB();
      // getAddress();
      // getGender();
      checkAccess();
    }
  }, [contract, id]);


  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     try {
  //       const accounts = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       console.log("Connected:", accounts[0]);
  //       setAccount(accounts[0]);
  //       localStorage.setItem("account", accounts[0]);
  //     } catch (error) {
  //       console.error("Error connecting to MetaMask:", error);
  //     }
  //   } else {
  //     alert(
  //       "MetaMask is not installed. Please install MetaMask and try again."
  //     );
  //   }
  // };

  const getName = async () => {
    setLoading(true)
    try {
      if(contract){
        await contract.requestAccessName(id,"ROW");
        console.log("send request")
      }
    } catch (error) {
      console.log("Error getting name:", error);
    }finally{
      setLoading(false)
    }
  };

  const getDOB = async () => {
    try {
      await contract.requestAccessDOB(id,"ROW");
    } catch (error) {
      console.log("Error getting DOB:", error);
    }
  };

  const getGender = async () => {
    try {
      await contract.requestAccessGender(id,"ROW");
    } catch (error) {
      console.log("Error getting gender:", error);
    }
  };

  const getAddress = async () => {
    try {
      await contract.requestAccessHomeAddress(id,"ROW");
    } catch (error) {
      console.log("Error getting address:", error);
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">

      {!account ? (
        // <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        //   <div className="text-center">
        //     <button
        //       onClick={connectWallet}
        //       className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-lg"
        //     >
        //       Connect Your Wallet
        //     </button>
        //   </div>
        // </div>
        <connectWallet></connectWallet>
      ) : (
        <div className="p-10 shadow-lg bg-slate-950 backdrop-blur-3xl rounded-lg w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 text-white text-center">
            User Data
          </h1>
          <div className="space-y-6">
            {/* Name Button */}
            {data.name === "" ? (
              <button
                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
                onClick={getName}
              >
                Get Name
              </button>
            ) : (
              <p className="text-lg font-semibold text-gray-700">
                Name: {data.name}
              </p>
            )}

            {/* DOB Button */}
            {data.dob === "" ? (
              <button className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md" onClick={getDOB}>
                Get DOB
              </button>
            ) : (
              <p className="text-lg font-semibold text-gray-700">
                DOB: {data.dob}
              </p>
            )}

            {/* Address Button */}
            {data.HomeAddress === "" ? (
              <button className="w-full py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all duration-300 shadow-md" onClick={getAddress}>
                Get Address
              </button>
            ) : (
              <p className="text-lg font-semibold text-gray-700">
                Address: {data.HomeAddress}
              </p>
            )}

            {/* Gender Button */}
            {data.gender === "" ? (
              <button className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md" onClick={getGender}>
                Get Gender
              </button>
            ) : (
              <p className="text-lg font-semibold text-gray-700">
                Gender: {data.gender}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
    // <>
    //   {!localStorage.getItem('account') ? (
    //     <>
    //       <h1>Connect Wallet</h1>
    //       <button
    //         onClick={connectWallet}
    //         className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-lg">
    //         Connect Your Wallet
    //       </button>
    //     </>
    //   ) : (
    //     <>
    //       <h1>User Data</h1>
    //       <div className="info-container">
    //         {/* Name Button */}
    //         {data.name === '' ? (
    //           <button className="info-button" onClick={getName}>Get Name</button>
    //         ) : (
    //           <p className="info-text">Name: {data.name}</p>
    //         )}

    //         {/* DOB Button */}
    //         {data.dob === '' ? (
    //           <button className="info-button">Get DOB</button>
    //         ) : (
    //           <p className="info-text">DOB: {data.dob}</p>
    //         )}

    //         {/* Address Button */}
    //         {data.HomeAddress === '' ? (
    //           <button className="info-button">Get Address</button>
    //         ) : (
    //           <p className="info-text">Address: {data.HomeAddress}</p>
    //         )}

    //         {/* Gender Button */}
    //         {data.gender === '' ? (
    //           <button className="info-button">Get Gender</button>
    //         ) : (
    //           <p className="info-text">Gender: {data.gender}</p>
    //         )}
    //       </div>
    //     </>
    //   )}
    // </>
  );
};

export default Company;
