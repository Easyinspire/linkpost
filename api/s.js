const cmd=require('./_db');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BOT=/facebookexternalhit|facebot|twitterbot|whatsapp|linkedinbot|telegrambot|slackbot|pinterest|discordbot|skypeuri|bingpreview|googlebot/i;
module.exports=async(req,res)=>{
  const code=String(req.query.code||'').replace(/[^a-z0-9]/g,'');
  const raw=await cmd(['GET','l:'+code]);
  if(!raw)return res.status(404).send('Link not found');
  const d=JSON.parse(raw);
  if(!BOT.test(req.headers['user-agent']||'')){
    res.setHeader('Cache-Control','no-store');
    return res.redirect(302,d.url);
  }
  const base=`https://${req.headers.host}`,img=`${base}/i/${code}.jpg`,title=esc(d.title||d.cta);
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<meta property="og:type" content="website"><meta property="og:title" content="${title}">
<meta property="og:description" content="${esc(d.cta)}"><meta property="og:url" content="${base}/s/${code}">
<meta property="og:image" content="${img}"><meta property="og:image:type" content="image/jpeg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${img}">
<meta http-equiv="refresh" content="0;url=${esc(d.url)}"></head><body><a href="${esc(d.url)}">${esc(d.cta)}</a></body></html>`);
};
