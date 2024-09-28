import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Outlet } from "react-router-dom";

const HomePage = () => {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        localStorage.setItem("account", accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="text-center">
        {localStorage.getItem("account") ? (
          <Outlet />
        ) : (
          <button
            onClick={connectWallet}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-lg">
            Connect Your Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
