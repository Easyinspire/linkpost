const cmd=require('./_db');
const A='abcdefghjkmnpqrstuvwxyz23456789';
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).end();
  const {url,cta,title,image}=req.body||{};
  if(!/^https?:\/\//i.test(url||'')||!String(image||'').startsWith('data:image/jpeg;base64,'))
    return res.status(400).json({error:'Invalid input'});
  let code='';for(let i=0;i<6;i++)code+=A[Math.floor(Math.random()*A.length)];
  try{
    await cmd(['SET','l:'+code,JSON.stringify({url,cta:cta||'Open Now',title:title||''})]);
    await cmd(['SET','i:'+code,image.split(',')[1]]);
    res.json({short:`https://${req.headers.host}/s/${code}`});
  }catch(e){res.status(500).json({error:e.message})}
};
