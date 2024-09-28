import React,{useState} from 'react'
import {ethers} from 'ethers'
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
          alert(
            "MetaMask is not installed. Please install MetaMask and try again."
          );
        }
      };
  return (
    <>
        {localStorage.getItem("account") ? <Outlet/> : <button onClick={connectWallet}>Chal Wallet Connect Kar</button>}
    </>
  )
}

export default HomePage