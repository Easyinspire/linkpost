const auth=require('./_auth');
module.exports=async(req,res)=>{
  const a=await auth(req);
  if(a==='ok')return res.json({ok:true});
  res.status(a==='blocked'?429:401).json({error:a==='blocked'?'Locked: 8 ghante ke liye band hai.':'Password ghalat hai'});
};
