const cmd=require('./_db');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
module.exports=async(req,res)=>{
  const code=String(req.query.code||'').replace(/[^a-z0-9]/g,'');
  const raw=await cmd(['GET','l:'+code]);
  if(!raw)return res.status(404).send('Link not found');
  const d=JSON.parse(raw);
  const base=`https://${req.headers.host}`,img=`${base}/i/${code}.jpg`,title=esc(d.title||d.cta);
  const u=esc(d.url),uj=JSON.stringify(d.url).replace(/</g,'\\u003c');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<meta property="og:type" content="website"><meta property="og:title" content="${title}">
<meta property="og:description" content="${esc(d.cta)}"><meta property="og:url" content="${base}/s/${code}">
<meta property="og:image" content="${img}"><meta property="og:image:type" content="image/jpeg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:image" content="${img}">
<script>location.replace(${uj})</script></head>
<body style="font-family:sans-serif;text-align:center;padding:40px"><p><a href="${u}">${esc(d.cta)}</a></p></body></html>`);
};
