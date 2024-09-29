const Enrollment = artifacts.require("./CompanyEnrollment.sol");

module.exports = function (deployer) {
  deployer.deploy(Enrollment);
};
