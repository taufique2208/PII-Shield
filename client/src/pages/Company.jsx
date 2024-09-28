import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import Aadhaar from '../contracts/Aadhaar.json';
// import './Company.css'; // Import your CSS file for styling

const Company = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [data, setData] = useState({ name: '', dob: '', HomeAddress: '', gender: '' });

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
      console.log('Error in connecting to contract:', error);
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
          console.log(name)
        } catch (error) {
          console.log('Error getting name:', error);
        }
      };
      
    if (contract && id) {
      getName();
    }
  }, [contract, id]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log('Connected:', accounts[0]);
        setAccount(accounts[0]);
        localStorage.setItem('account', accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
  };

  const getName = async () => {
    try {
      await contract.requestAccessName(id);
    } catch (error) {
      console.log('Error getting name:', error);
    }
  }

  return (
    <>
      {!localStorage.getItem('account') ? (
        <>
          <h1>Connect Wallet</h1>
          <button
            onClick={connectWallet}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-lg">
            Connect Your Wallet
          </button>
        </>
      ) : (
        <>
          <h1>User Data</h1>
          <div className="info-container">
            {/* Name Button */}
            {data.name === '' ? (
              <button className="info-button" onClick={getName}>Get Name</button>
            ) : (
              <p className="info-text">Name: {data.name}</p>
            )}

            {/* DOB Button */}
            {data.dob === '' ? (
              <button className="info-button">Get DOB</button>
            ) : (
              <p className="info-text">DOB: {data.dob}</p>
            )}

            {/* Address Button */}
            {data.HomeAddress === '' ? (
              <button className="info-button">Get Address</button>
            ) : (
              <p className="info-text">Address: {data.HomeAddress}</p>
            )}

            {/* Gender Button */}
            {data.gender === '' ? (
              <button className="info-button">Get Gender</button>
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
