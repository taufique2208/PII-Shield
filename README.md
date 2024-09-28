# Blockchain-Based PII Management Portal

## Overview
This project aims to solve Personally Identifiable Information (PII) privacy concerns by providing a secure way to store, share, and manage Aadhar data on the blockchain. Users can securely fill out their Aadhar details through the portal, which then stores the information on a blockchain network. A link is generated for the user, which can be shared with companies or organizations that require the data. Companies can request access to specific fields, and users can provide consent before the company can view any information.

## Problem Statement
The handling of PII such as Aadhar data often raises privacy and security issues due to unauthorized access and data misuse. Users typically lack control over how their information is shared and used by companies, leading to potential privacy violations. This project addresses these concerns by utilizing blockchain to give users complete control over their data access.

## Solution
- **Data Storage on Blockchain**: Users enter their Aadhar information on the portal, which is securely stored on a blockchain.
- **Access Request and Consent Management**: Companies can request access to specific data fields such as name or address, and users are prompted to provide consent before the information is revealed.
- **Link-Based Sharing**: Users receive a unique link that they can share with companies. The link allows companies to request access to certain data fields, and no data is accessible without the user's explicit permission.

## Features
- Secure storage of Aadhar data on the blockchain.
- Unique link generation for sharing data access with companies.
- Consent-based access control for each requested data field.
- Full transparency and auditability of data access history.

## Tech Stack
- **Frontend**: React, JavaScript, HTML, CSS
- **Blockchain**: Ethereum
- **Smart Contracts**: Solidity
- **Tools**: Truffle, Ganache

## How It Works
1. **User Registration**: Users register and input their Aadhar details through the portal.
2. **Data Storage**: The data is encrypted and stored on the blockchain, and a unique link is generated.
3. **Link Sharing**: Users share the link with a company for potential access.
4. **Access Request**: The company requests access to specific fields (e.g., name, address).
5. **Consent Management**: Users receive a notification and can choose to provide or deny access.
6. **Data Access**: If consent is given, the company can view only the fields for which permission is granted.
  
