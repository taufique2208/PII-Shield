import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Outlet } from "react-router-dom";
// import "./HomePage.css";
import CompanyEnrollment from "../contracts/CompanyEnrollment.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navbar from "../components/Navbar";
import { useAccount } from "wagmi";


const HomePage = () => {
  // const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading
  const [isCompany, setIsCompany] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const account = useAccount();
  const [accounts, setAccounts] = useState(account)

  useEffect(() => {


    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.REACT_APP_ENROLLMENT_CONTRACT_ADDRESS,
      CompanyEnrollment.abi,
      signer
    );
    console.log(contract)
    setContract(contract);

  }, []);

  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     try {
  //       const accounts = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       localStorage.setItem("account", accounts[0]);

  //       if (contract) {
  //         checkIfAccountIsCompany(accounts[0], contract);
  //       }
  //     } catch (error) {
  //       console.error("Error connecting to MetaMask:", error);
  //     }
  //   } else {
  //     alert(
  //       "MetaMask is not installed. Please install MetaMask and try again."
  //     );
  //   }
  // };

  useEffect(() => {
    setAccounts(account)
    if (accounts.address && contract) {
      console.log(accounts.address.toString())
      checkIfAccountIsCompany(account.address)
    }
  }, [accounts.address, contract, localStorage.getItem('wagmi.store')])

  const checkIfAccountIsCompany = async (address) => {
    if (!contract) {
      console.error("Contract is not initialized.");
      return;
    }
    setLoading(true);
    try {
      const isCompany = await contract.checkCompany(
        address
      );
      console.log("Is account a company:", isCompany);
      setIsCompany(isCompany);
    } catch (error) {
      console.error("Error checking if account is a company:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const EnrollCompany = async () => {
    // e.preventDefault()
    try {
      await contract.enroll(companyName);
      console.log("Company enrolled successfully");
      setIsCompany(true);
    } catch (error) {
      console.error("Error enrolling company:", error);
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
    <>
      <Navbar />
      {!account.address ? (
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
      
      ) : isCompany ? (
        <Outlet/>
      ) : (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
          <div className="text-center w-full max-w-md p-8 space-y-3 rounded-xl dark:bg-gray-50 dark:text-gray-800">
            <h1 className="text-2xl font-bold text-center">Signup</h1>

            <form
              noValidate=""
              onSubmit={(e) => {
                e.preventDefault();
                EnrollCompany();
              }}
              className="space-y-6"
            >
              <div className="space-y-1 text-sm">
                <label className="block dark:text-gray-600">
                  Register Your Company Name Below :
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
                />
              </div>
              <button
                type="submit" // Only keep the type="submit" here
                className="text-center w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                Enroll Company
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
