const cmd=require('./_db');
module.exports=async(req,res)=>{
  const code=String(req.query.code||'').replace(/\.jpg$/,'').replace(/[^a-z0-9]/g,'');
  const b=await cmd(['GET','i:'+code]);
  if(!b)return res.status(404).end();
  res.setHeader('Content-Type','image/jpeg');
  res.setHeader('Cache-Control','public, max-age=31536000, immutable');
  res.end(Buffer.from(b,'base64'));
};
