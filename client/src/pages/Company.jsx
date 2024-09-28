import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import Aadhaar from "../contracts/Aadhaar.json";
import "./Company.css"; // Import your CSS file for styling

const Company = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [data, setData] = useState({
    name: "",
    dob: "",
    HomeAddress: "",
    gender: "",
  });

  useEffect(() => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        Aadhaar.abi,
        signer
      );
      setContract(contract);
    } catch (error) {
      console.log("Error in connecting to contract:", error);
    }
  }, []);

  useEffect(() => {
    // const checkAccess = async () => {
    //   try {
    //     console.log(id)
    //     const information = await contract.checkAllAccess(id);
    //     console.log(information);
    //     setData({
    //       name: information.name,
    //       dob: information.DOB,
    //       HomeAddress: information.HomeAddress,
    //       gender: information.gender,
    //     });
    //   } catch (error) {
    //     console.log('Error getting data:', error);
    //   }
    // };
    const getName = async () => {
      try {
        const name = await contract.retrieveName(id);
        setData((prevData) => ({ ...prevData, name }));
        console.log(name);
      } catch (error) {
        console.log("Error getting name:", error);
      }
    };

    const getDOB = async () => {
      try {
        const DOB = await contract.retrieveDOB(id);
        setData((prevData) => ({ ...prevData, DOB }));
        console.log(DOB);
      } catch (error) {
        console.log("Error getting name:", error);
      }
    };

    const getAddress = async () => {
      try {
        const address = await contract.retrieveHomeAddress(id);
        setData((prevData) => ({ ...prevData, address }));
        console.log(address);
      } catch (error) {
        console.log("Error getting name:", error);
      }
    };

    const getGender = async () => {
      try {
        const gender = await contract.retrieveGender(id);
        setData((prevData) => ({ ...prevData, gender }));
        console.log(gender);
      } catch (error) {
        console.log("Error getting name:", error);
      }
    };

    if (contract && id) {
      getName();
      getDOB();
      getAddress();
      getGender();
    }
  }, [contract, id]);

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

  const getName = async () => {
    try {
      await contract.requestAccessName(id);
    } catch (error) {
      console.log("Error getting name:", error);
    }
  };

  const getDOB = async () => {
    try {
      await contract.requestAccessDOB(id);
    } catch (error) {
      console.log("Error getting DOB:", error);
    }
  };

  const getGender = async () => {
    try {
      await contract.requestAccessGender(id);
    } catch (error) {
      console.log("Error getting gender:", error);
    }
  };

  const getAddress = async () => {
    try {
      await contract.requestAccessHomeAddress(id);
    } catch (error) {
      console.log("Error getting address:", error);
    }
  };

  return (
    <>
      {!localStorage.getItem("account") ? (
        <>
          <h1>Connect Wallet</h1>
          <button onClick={connectWallet}>Connect MetaMask</button>
        </>
      ) : (
        <>
          <h1>User Data</h1>
          <div className="info-container">
            {/* Name Button */}
            {data.name === "" ? (
              <button className="info-button" onClick={getName}>
                Get Name
              </button>
            ) : (
              <p className="info-text">Name: {data.name}</p>
            )}

            {/* DOB Button */}
            {data.dob === "" ? (
              <button className="info-button" onClick={getDOB}>
                Get DOB
              </button>
            ) : (
              <p className="info-text">DOB: {data.dob}</p>
            )}

            {/* Address Button */}
            {data.HomeAddress === "" ? (
              <button className="info-button" onClick={getAddress}>
                Get Address
              </button>
            ) : (
              <p className="info-text">Address: {data.HomeAddress}</p>
            )}

            {/* Gender Button */}
            {data.gender === "" ? (
              <button className="info-button" onClick={getGender}>
                Get Gender
              </button>
            ) : (
              <p className="info-text">Gender: {data.gender}</p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Company;
