const PriceFeed = artifacts.require("PriceFeed");
const BinaryOption = artifacts.require("BinaryOption");

module.exports = async function (deployer) {
  await deployer.deploy(PriceFeed);
  await deployer.deploy(BinaryOption);
};
