const BinaryOption = artifacts.require("BinaryOption");

module.exports =async function (deployer, _, accounts) {
  await deployer.deploy(BinaryOption);
  await web3.eth.sendTransaction({
	  from: accounts[0],
	  to: "0x5318CD7Da47999e9E121D917a43f0D68e6fa46D0",
	  value: web3.utils.toWei('1','ether')
  })
};
