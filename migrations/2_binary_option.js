const BinaryOption = artifacts.require("BinaryOption");

module.exports =async function (deployer, _, accounts) {
  await deployer.deploy(BinaryOption);
  await web3.eth.sendTransaction({
	  from: accounts[0],
	  to: "0xDEdbf82289edB28763463D1FF482a9A94604E6dc",
	  value: web3.utils.toWei('1','ether')
  })
};
