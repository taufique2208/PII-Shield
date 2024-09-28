const Aadhaar = artifacts.require("./Aadhaar.sol");

module.exports = function(deployer) {
    deployer.deploy(Aadhaar);
};