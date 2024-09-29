// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


contract CompanyEnrollment {
    
    mapping(address => string) public companies;

    function enroll(string memory name) public {
        companies[msg.sender] = name;
    }

    function getCompany(address addr) public view returns (string memory) {
        return companies[addr];
    }

    function checkCompany(address addr) public view returns (bool) {
        return bytes(companies[addr]).length > 0;
    }
}