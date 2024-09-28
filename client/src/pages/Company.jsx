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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!localStorage.getItem('account') ? (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center">
          <button
            onClick={connectWallet}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-lg">
            Connect Your Wallet
          </button>
        </div>
      </div>
      ) : (
        <div className="p-10 bg-white shadow-lg rounded-lg w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">User Data</h1>
          <div className="space-y-6">
            {/* Name Button */}
            {data.name === '' ? (
              <button
                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
                onClick={getName}
              >
                Get Name
              </button>
            ) : (
              <p className="text-lg font-semibold text-gray-700">Name: {data.name}</p>
            )}

            {/* DOB Button */}
            {data.dob === '' ? (
              <button className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md">
                Get DOB
              </button>
            ) : (
              <p className="text-lg font-semibold text-gray-700">DOB: {data.dob}</p>
            )}

            {/* Address Button */}
            {data.HomeAddress === '' ? (
              <button className="w-full py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all duration-300 shadow-md">
                Get Address
              </button>
            ) : (
              <p className="text-lg font-semibold text-gray-700">Address: {data.HomeAddress}</p>
            )}

            {/* Gender Button */}
            {data.gender === '' ? (
              <button className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md">
                Get Gender
              </button>
            ) : (
              <p className="text-lg font-semibold text-gray-700">Gender: {data.gender}</p>
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
