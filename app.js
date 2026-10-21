const IMG={"Beginner":"beginner.webp","Novice":"novice.webp","Intermediate":"intermediate.webp","Advanced":"advanced.webp","Expert":"expert.webp","Legendary":"legendary.webp"};
const TIERS=[{n:"Beginner",min:1,c:"#8d99b8",s:1},{n:"Novice",min:100,c:"#d08a5a",s:2},{n:"Intermediate",min:250,c:"#6fb0ff",s:3},{n:"Advanced",min:500,c:"#9b6bff",s:4},{n:"Expert",min:1000,c:"#ffc933",s:5},{n:"Legendary",min:2500,c:"#3de8ff",s:6}];
const MAX=8,MO=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],DN=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
let data={};try{data=JSON.parse(localStorage.getItem("ht")||"{}")}catch(e){}
const save=()=>{try{localStorage.setItem("ht",JSON.stringify(data))}catch(e){}};
const p2=n=>String(n).padStart(2,"0");
const key=d=>d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate());
const today=()=>key(new Date());
const mon=d=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x};
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const total=()=>Object.values(data).reduce((a,b)=>a+b,0);
const tierOf=t=>{let r=null;TIERS.forEach(x=>{if(t>=x.min)r=x});return r};
const sum=pred=>Object.entries(data).reduce((a,[k,v])=>pred(k)?a+v:a,0);
// grouping & records
const grp={day:k=>k,week:k=>{const [y,m,d]=k.split("-");return key(mon(new Date(+y,m-1,+d)))},month:k=>k.slice(0,7),year:k=>k.slice(0,4)};
function totals(type){const o={};for(const k in data){const g=grp[type](k);o[g]=(o[g]||0)+data[k]}return o}
function isRec(type,k){const t=totals(type),v=t[k]||0;if(v<=0)return false;return Object.keys(t).every(g=>g>=k||t[g]<v)}
function medal(t){const src=IMG[t.n]||IMG.Beginner;return `<img class="md" alt="${t.n}" src="${src}" style="${t.n=="None"?"filter:grayscale(1);opacity:.3":""}">`}
const emptyBadge={n:"None",c:"#445",s:1};
// views
let tab="home",rtype="week",anchor=new Date();
const V=document.getElementById("v"),NAV=document.getElementById("nav");
const ico={home:'<path d="M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3z"/>',rep:'<path d="M4 20h4V9H4zm6 0h4V4h-4zm6 0h4v-8h-4z"/>',pro:'<path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z"/>'};
function render(){NAV.innerHTML=[["home","Home"],["rep","Reports"],["pro","Profile"]].map(([k,l])=>`<button class="${tab==k?"on":""} ${k=="rep"?"r":""}" onclick="tab='${k}';render()"><svg viewBox="0 0 24 24">${ico[k]}</svg>${l}</button>`).join("");
V.innerHTML=tab=="home"?home():tab=="rep"?reports():profile();V.className=tab;V.scrollTop=0;const sc=document.getElementById("sc");if(sc){const t=sc.querySelector(`[data-k="${today()}"]`);if(t)sc.scrollLeft=Math.max(0,t.offsetLeft-sc.offsetLeft-120)}}
function home(){const t=total(),tr=tierOf(t),d=data[today()]||0;
const msgs=["Let's get started!","Great start!","Keep going!","You can do it!","Halfway there!","Stay strong!","One more to go!","Almost there!","Goal complete!"];
const IC={"0": "<path d=\"M12 2c1 4 6 6 6 12a6 6 0 01-12 0c0-3 2-4 3-7 1 1 2 2 2 4 1-3 1-6 1-9z\"/>", "1": "<path d=\"M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.2 6 20.6l1.3-6.8-5-4.7 6.8-.8z\"/>", "2": "<path d=\"M13 2L5 13h6l-1 9 9-12h-6z\"/>", "3": "<path d=\"M3 7l5 4 4-6 4 6 5-4-2 12H5z\"/>"};const L=[["1 Hour","Starter"],["2 Hours","Focused"],["4 Hours","On Fire"],["8 Hours","Legend"]];
return `${topCard(t,tr)}<div class="hero"><button class="add" id="ab" onclick="add()" ${d>=MAX?"disabled":""}><i>+</i>${d>=MAX?"Limit reached":"Add 1 Hour"}</button>
<div class="sub"><b>${d}h</b> worked today · max ${MAX}h per day</div><button class="undo" onclick="undo()" style="visibility:${d?"visible":"hidden"}">Undo last hour</button></div>
<div class="card"><div class="row"><div><h3>Daily Goal</h3><small>8 hours</small></div><span class="hint">⚡ ${msgs[d]}</span></div>
<div class="steps">${[1,2,3,4,5,6,7,8].map(i=>`<div class="st ${i<=d?"d":""}"><span>${i<=d?"✓":""}</span>${i}h</div>`).join("")}</div></div>
<div class="achs"><h3><span style="font-size:24px">🏆</span>Your Achievements</h3><div class="ach">${L.map((a,i)=>`<div class="a a${i} ${d>=[1,2,4,8][i]?"on":""}"><div class="ic"><svg viewBox="0 0 24 24">${IC[i]}</svg></div><b>${a[0]}</b><span>${a[1]}</span></div>`).join("")}</div></div>`}
function topCard(t,tr){const nx=TIERS.find(x=>x.min>t),lo=tr?tr.min:0,pc=nx?Math.max(0,Math.min(100,(t-lo)/(nx.min-lo)*100)):100;
return `<div class="topc" onclick="tab='pro';render()">${medal(tr||emptyBadge)}<div class="tm"><div class="row"><b>${t}h total</b><small>${tr?tr.n:"No badge yet"}</small></div><div class="sl" style="--c:${nx?nx.c:(tr?tr.c:"#8b5cff")}"><i style="width:${pc}%"></i><u style="left:${pc}%"></u></div><div class="row"><small>${nx?`<b style="color:${nx.c}">${nx.min-t}h</b> to ${nx.n}`:"Top badge reached"}</small>${nx?`<small>${t}/${nx.min}h</small>`:""}</div></div>${nx?medal(nx).replace('class="md"','class="md nx"'):""}</div>`}
function add(){const k=today();if((data[k]||0)>=MAX)return;data[k]=(data[k]||0)+1;save();render();const b=document.getElementById("ab");if(b){b.classList.add("pop")}}
function undo(){const k=today();if(data[k]>0){data[k]--;if(!data[k])delete data[k];save();render()}}
function setT(t){rtype=t;anchor=new Date();render()}
function shift(n){const a=new Date(anchor);if(rtype=="week")a.setDate(a.getDate()+7*n);else if(rtype=="month")a.setMonth(a.getMonth()+n,1);else a.setFullYear(a.getFullYear()+n,0,1);anchor=a;render()}
function fmt(h){return h+"h"}
function colHtml(d,lbl,mini){const kk=key(d),v=data[kk]||0,r=isRec("day",kk);return `<div class="col ${mini?"mini":""} ${r?"rec":""}" data-k="${kk}"><div class="h">${v}${mini?"":"h"}</div>${mini?"":"/ 8h"}<div style="margin-top:6px">${Array.from({length:8},(_,j)=>`<div class="blk ${8-j<=v?"f":""}"></div>`).join("")}</div><div class="n">${lbl}</div>${mini?d.getDate():MO[d.getMonth()]+" "+d.getDate()}</div>`}
function reports(){let label,k,goal,body,dk=key(anchor);
if(rtype=="week"){const m=mon(anchor),e=addD(m,6);k=key(m);label=`${MO[m.getMonth()]} ${m.getDate()} – ${MO[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;goal=56;
body=`<div class="card"><div class="wk">${DN.map((n,i)=>colHtml(addD(m,i),n)).join("")}</div>
<div class="leg"><i></i>1 block = 1 hour <span class="rl" style="margin-left:10px"></span>Daily record</div></div>`}
else if(rtype=="month"){const y=anchor.getFullYear(),mo=anchor.getMonth(),n=new Date(y,mo+1,0).getDate(),off=(new Date(y,mo,1).getDay()+6)%7;k=y+"-"+p2(mo+1);label=MO[mo]+" "+y;goal=n*8;
const mk=(f,t)=>{let c="";for(let i=f;i<=t;i++){const d=new Date(y,mo,i);c+=colHtml(d,"MTWTFSS"[(d.getDay()+6)%7],1)}return `<div class="wk m">${c}</div>`};
body=`<div class="card">${mk(1,16)}<div style="height:10px"></div>${mk(17,n)}<div class="leg"><i></i>1 block = 1 hour <span class="rl" style="margin-left:10px"></span>Daily record</div></div>`}
else{const y=anchor.getFullYear();k=""+y;label=""+y;goal=365*8;const mt=totals("month");
body=`<div class="card"><div class="yr">${MO.map((n,i)=>{const kk=y+"-"+p2(i+1),v=mt[kk]||0;return `<div class="yc ${isRec("month",kk)?"rec":""}"><b>${v||""}</b><i style="height:${Math.min(100,v/248*100)}%"></i>${n}</div>`}).join("")}</div><div class="leg"><span class="rl"></span>Monthly record · hours per month</div></div>`}
const v=totals(rtype)[k]||0,r=isRec(rtype,k),pc=Math.round(v/goal*100),h=Math.floor(v);
const nm={week:"Weekly",month:"Monthly",year:"Yearly"}[rtype];
const gl=rtype=="week"?"of 56h goal (8h × 7 days)":rtype=="month"?`of ${goal}h goal (8h × ${goal/8} days)`:"of 2,920h goal (8h × 365 days)";
return `<h1>Reports</h1><div class="seg">${["week","month","year"].map(t=>`<button class="${rtype==t?"on":""}" onclick="setT('${t}')">${{week:"Weekly",month:"Monthly",year:"Yearly"}[t]}</button>`).join("")}</div>
<div class="nv"><button onclick="shift(-1)">‹</button><span>${label}</span><button onclick="shift(1)">›</button></div>
<div class="tot ${r?"rec":""}"><div class="row"><span class="lb">${r?"👑 NEW RECORD · ":""}${nm.toUpperCase()} TOTAL</span><span class="pill">${pc}%</span></div><div class="big">${v}h</div><small style="color:var(--mu)">${gl}</small><div class="bar"><i style="width:${Math.min(100,pc)}%"></i></div></div>${body}`}
function profile(){const t=total(),cur=tierOf(t),nx=TIERS.find(x=>x.min>t);
return `<h1>Profile</h1><div class="card cen">${medal(cur||emptyBadge).replace("<img","<img style='width:170px;height:170px;margin:-10px auto'")}<div class="big2">${t}h</div><div style="font-weight:700;color:${cur?cur.c:"var(--mu)"}">${cur?cur.n:"Log your first hour"}</div>
${nx?`<div class="bar" style="background:#16203a"><i style="width:${Math.max(2,(t-(cur?cur.min:0))/(nx.min-(cur?cur.min:0))*100)}%;background:${nx.c};box-shadow:none"></i></div><small style="color:var(--mu);display:block;margin-top:8px">${nx.min-t}h to ${nx.n}</small>`:"<small style='color:var(--mu)'>Top tier reached</small>"}</div>
<div class="card">${TIERS.map((x,i)=>{const hi=TIERS[i+1]?TIERS[i+1].min-1:null,rng=hi?`${x.min}–${hi} hours`:`${x.min.toLocaleString()}+ hours`;return `<div class="tier ${t<x.min?"lock":""} ${cur&&cur.n==x.n?"cur":""}">${medal(x)}<div><b style="color:${x.c}">${x.n}</b><small>${rng}</small></div></div>`}).join("")}</div>`}
render();
