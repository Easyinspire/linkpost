const URL_=process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL;
const TOKEN=process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN;
module.exports=async function cmd(args){
  const r=await fetch(URL_,{method:'POST',headers:{Authorization:'Bearer '+TOKEN},body:JSON.stringify(args)});
  const j=await r.json();
  if(j.error)throw new Error(j.error);
  return j.result;
};
