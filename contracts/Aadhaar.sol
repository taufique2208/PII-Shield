// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Aadhaar {
    event userNotification(string field, address company, address indexed user,string name);

    // struct to store user aadhar
    struct User_Aadhaar {
        string name;
        string DOB;
        string HomeAddress;
        string gender;
    }

    mapping(address => User_Aadhaar) public aadhaarMapping; // mapping which maps user_address to his struct Aadhar

    mapping(address => address[]) public accessMappingName; // mapping whihc maps user_address to the list of address which can access the user data. Used for the access modifiier
    mapping(address => address[]) public accessMappingDOB;
    mapping(address => address[]) public accessMappingHomeAddress;
    mapping(address => address[]) public accessMappingGender;

    function requestAccessName(address userAddress,string memory name) public {
        // function used by company to request access

        emit userNotification("Name", msg.sender, userAddress,name);
    }

    function grantAccessName(address userAddress) public {
        accessMappingName[msg.sender].push(userAddress);    
    }

    function requestAccessDOB(address userAddress,string memory name) public {
        // function used by company to request access
        emit userNotification("DOB", msg.sender, userAddress,name);
    }

    function grantAccessDOB(address userAddress) public {
        accessMappingDOB[msg.sender].push(userAddress);
    }

    function requestAccessHomeAddress(address userAddress,string memory name) public {
        // function used by company to request access
        emit userNotification("Home Address", msg.sender, userAddress,name);
    }

    function grantAccessHomeAddress(address userAddress) public {
        accessMappingHomeAddress[msg.sender].push(userAddress);
    }

    function requestAccessGender(address userAddress,string memory name) public {
        // function used by company to request access
        emit userNotification("Gender", msg.sender, userAddress,name);
    }

    function grantAccessGender(address userAddress) public {
        accessMappingGender[msg.sender].push(userAddress);
    }

    function getAllAccess(
        address userAddress
    ) public view returns (User_Aadhaar memory) {
        User_Aadhaar memory user = User_Aadhaar(
            retrieveName(userAddress),
            retrieveDOB(userAddress),
            retrieveHomeAddress(userAddress),
            retrieveGender(userAddress)
        );
        return user;
    }

    //NEECHE wale commented code hai babu ye kyu padhre ho
    // mapping(address => AccessRequest) public accessRequests;

    // event AccessRequested(address indexed requester);

    // event AccessApproved(address indexed approver);

    //ISKE LIYE TU COMMENTS PADHRA BABA?? NAME SAYS ITSELF
    function createUserDocuments(
        string memory name,
        string memory DOB,
        string memory home_address,
        string memory gender
    ) public {
        // function used by user/ML model to create new aadhar struct
        User_Aadhaar memory user = User_Aadhaar(
            name,
            DOB,
            home_address,
            gender
        );
        aadhaarMapping[msg.sender] = user;
    }

    //This modifies iterates over the accessMapping and checks Ki if the user has the access or not
    // modifier canAccess(address userAddress) {
    //   bool found = false;
    //    for (uint256 i = 0; i < accessMapping[userAddress].length; i++){
    //             if (accessMapping[userAddress][i] == msg.sender) {
    //                 found=true;
    //             }
    //         }
    //   require(found);
    //   _;
    // }

    function isNull() public pure returns (string memory) {
        return "Not Allowed";
    }

    modifier canAccessName(address userAddress) {
        bool found = false;
        for (uint256 i = 0; i < accessMappingName[userAddress].length; i++) {
            if (accessMappingName[userAddress][i] == msg.sender) {
                found = true;
            }
        }
        //   require(found,"Not Given access by owner of Name");
        if (found) {
            _;
        } else {
            isNull();
        }
    }
    modifier canAccessDOB(address userAddress) {
        bool found = false;
        for (uint256 i = 0; i < accessMappingDOB[userAddress].length; i++) {
            if (accessMappingDOB[userAddress][i] == msg.sender) {
                found = true;
            }
        }
        //   require(found,"Not Given access by owner of DOB");
        //   _;
        if (found) {
            _;
        } else {
            isNull();
        }
    }
    modifier canAccessHomeAddress(address userAddress) {
        bool found = false;
        for (
            uint256 i = 0;
            i < accessMappingHomeAddress[userAddress].length;
            i++
        ) {
            if (accessMappingHomeAddress[userAddress][i] == msg.sender) {
                found = true;
            }
        }
        //   require(found,"Not Given access by owner of Home Address");
        //   _;
        if (found) {
            _;
        } else {
            isNull();
        }
    }
    modifier canAccessGender(address userAddress) {
        bool found = false;
        for (uint256 i = 0; i < accessMappingGender[userAddress].length; i++) {
            if (accessMappingGender[userAddress][i] == msg.sender) {
                found = true;
            }
        }
        //   require(found,"Not Given access by owner of Gender");
        //   _;
        if (found) {
            _;
        } else {
            isNull();
        }
    }

    modifier doesExist(address userAddress) {
        require(
            bytes(aadhaarMapping[userAddress].name).length > 0,
            "User does not exist"
        );
        _;
    }

    //first checks weather the company has the access to retrieve and then returns Name of Aadhaar to the company
    function retrieveName(
        address userAddress
    )
        public
        view
        canAccessName(userAddress)
        doesExist(userAddress)
        returns (string memory name)
    {
        return aadhaarMapping[userAddress].name;
    }

    //first checks weather the company has the access to retrieve and then returns DOB of Aadhaar to the company
    function retrieveDOB(
        address userAddress
    )
        public
        view
        canAccessDOB(userAddress)
        doesExist(userAddress)
        returns (string memory DOB)
    {
        return aadhaarMapping[userAddress].DOB;
    }

    //first checks weather the company has the access to retrieve and then returns HomeAddress of Aadhaar to the company
    function retrieveHomeAddress(
        address userAddress
    )
        public
        view
        canAccessHomeAddress(userAddress)
        doesExist(userAddress)
        returns (string memory HomeAddress)
    {
        return aadhaarMapping[userAddress].HomeAddress;
    }

    //first checks weather the company has the access to retrieve and then returns gender of Aadhaar to the company
    function retrieveGender(
        address userAddress
    )
        public
        view
        canAccessGender(userAddress)
        doesExist(userAddress)
        returns (string memory gender)
    {
        return aadhaarMapping[userAddress].gender;
    }

    function checkAllAccess(
        address userAddress
    ) public view doesExist(userAddress) returns (User_Aadhaar memory) {
        User_Aadhaar memory user = User_Aadhaar(
            retrieveName(userAddress),
            retrieveDOB(userAddress),
            retrieveHomeAddress(userAddress),
            retrieveGender(userAddress)
        );

        return user;
    }
}
