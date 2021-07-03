const Aggre = artifacts.require("Aggre");
const BinaryOption = artifacts.require("BinaryOption");

module.exports = async function (deployer) {
  await deployer.deploy(Aggre);
  await deployer.deploy(BinaryOption);
};
