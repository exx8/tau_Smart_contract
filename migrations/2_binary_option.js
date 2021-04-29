const BinaryOption = artifacts.require("BinaryOption");

module.exports =async function (deployer, _, accounts) {
  await deployer.deploy(BinaryOption);
  /*await web3.eth.sendTransaction({
	  from: accounts[0],
	  to: '0x41b121f607965E9488BF4A4b34ABCDfd99E10C0D',
	  value: web3.utils.toWei('1','ether')
  })*/
};
