const cmd=require('./_db');const crypto=require('crypto');
const h=s=>crypto.createHash('sha256').update(String(s)).digest();
const MAX_FAILS=2, LOCK_SECONDS=8*60*60;
module.exports=async function auth(req){
  const pw=process.env.ADMIN_PASSWORD;
  if(!pw)return 'deny';
  const ip=String(req.headers['x-forwarded-for']||'x').split(',')[0].trim();
  const key='fail:'+ip;
  const n=parseInt(await cmd(['GET',key])||'0',10);
  if(n>=MAX_FAILS)return 'blocked';
  if(crypto.timingSafeEqual(h(req.headers['x-admin-password']||''),h(pw))){
    if(n)await cmd(['DEL',key]);
    return 'ok';
  }
  await cmd(['INCR',key]);await cmd(['EXPIRE',key,LOCK_SECONDS]);
  return 'deny';
};
