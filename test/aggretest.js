
const Aggre = artifacts.require('Aggre');

contract('Aggre', () => {
	
  let aggr = null;
  before(async()=>{
    aggr = await Aggre.deployed();
  });
  
  it('Initial aggr is:', async () => {
	  
	  const result=await aggr.getThePrice(); 
	  console.log(result);
	  assert(result.toNumber()!==0);
		
  });
  
});