
const BinaryOption = artifacts.require('BinaryOption');

contract('BinaryOption', () => {
	
  let binaryOption = null;
  before(async()=>{
    binaryOption = await BinaryOption.deployed();
  });
  
  it('Initial battleId is:', async () => {
	  
	  const result=await binaryOption.getId();
    await binaryOption.addBattle("Dollar",5,true); 
	
		assert(result.toNumber()===0);
		
  });
  
  it('battleId after add:', async () => {
	  
	const result=await binaryOption.getId();
		console.log(result.toNumber());
		assert(result.toNumber()===1);
		
  });
  
  it('betDate of the only existing battle:', async () => {
	  
    
	const result=await binaryOption.getIndex(0);
		console.log(result.toNumber());
		assert(result.toNumber()===5); // need to add current time
		
  });
  
  it('betDate of an empty entry:', async () => {
	  
    
	const result=await binaryOption.getIndex(1);
		console.log(result.toNumber());
		assert(result.toNumber()===0);
		
  });
  
  it('betDate of an empty entry:', async () => {
	  
    
	const result=await binaryOption.getIndex(1);
		console.log(result.toNumber());
		assert(result.toNumber()===0);
		
  });
  
  it('Accept existing battle:', async () => {
	  
    try{
		await binaryOption.acceptBattle(0);
		return;
	}
	catch(e){
		console.log("got unexpected error\n");
		//assert(e.message.includes("Battle number isn't exist.\n"));
		
	};
	assert(false);
	
		
  });
  
  it('Reject non-existing battle:', async () => {  
    try{
		await binaryOption.acceptBattle(1);
		
	}
	catch(e){
		assert(e.message.includes("Battle number isn't exist.\n"));
		return;
		
	};
	assert(false);	
  });
  
  it('Remove non exisitng battle:', async () => {  
    try{
		await binaryOption.removeBattle(1);
		
	}
	catch(e){
		assert(e.message.includes("Battle number isn't exist.\n"));
		return;
		
	};
	assert(false);	
  });
  
  it('Remove exisitng battle:', async () => {  
    try{
		await binaryOption.removeBattle(0);
		return;
	}
	catch(e){
		console.log("got unexpected error\n");
	};
	assert(false);	
  });
  
  it('Remove same battle again:', async () => {  
    try{
		await binaryOption.removeBattle(0);
		
	}
	catch(e){
		assert(e.message.includes("Battle number isn't exist.\n"));
		return;
		
	};
	assert(false);	
  });
  
  
  


  
});
