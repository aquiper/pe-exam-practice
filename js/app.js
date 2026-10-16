(function(){
"use strict";
// ---------------- constants ----------------
const SPEC={1:"Basic Engineering Practice",2:"Mechanics of Materials",3:"Mechanical Attachments",4:"Power Transmission",5:"Mechanical Components and Assemblies",6:"Supportive Knowledge"};
const SPECRANGE={1:"12–16",2:"19–24",3:"10–13",4:"10–13",5:"18–22",6:"8–12"};
const SPECMID={1:14,2:21.5,3:11.5,4:11.5,5:20,6:10};
const MOCK={1:13,2:20,3:10,4:10,5:18,6:9};
const SUBNAMES={"1.A":"Engineering Terms, Symbols, and Drawings","1.B":"Project Management and Economic Analysis","1.C":"Design Methodology","1.D":"Physical Properties of Materials",
"2.A":"Axial Loading","2.B":"Shear and Transverse Loading","2.C":"Bending","2.D":"Buckling","2.E":"Torsion","2.F":"Combined Loading","2.G":"Static Failure","2.H":"Fatigue Failure","2.I":"Thermal and Interference Stresses",
"3.A":"Bonds (welding, brazing, adhesives)","3.B":"Non-threaded Fasteners","3.C":"Threaded Fasteners",
"4.A":"Gears and Gear Trains","4.B":"Bearings","4.C":"Belts, Chains, Clutches, Brakes, Power Screws","4.D":"Shafts and Keys","4.E":"Motors and Engines",
"5.A":"Pressurized Vessels and Piping","5.B":"Hydraulic and Pneumatic Components","5.C":"Beams, Trusses, and Frames","5.D":"Springs","5.E":"Vibrating Systems","5.F":"Basic Machines and Mechanisms",
"6.A":"Manufacturing Methods","6.B":"Fits and Tolerances","6.C":"Codes and Standards","6.D":"Computational Methods","6.E":"Instrumentation, Testing, Inspection, and Quality","6.F":"Chemical Processes"};
const CUT=0.65; // ASSUMED, NCEES does not publish a cut score
const SRSINT=[0,1,3,7,14,30],DAY=864e5,SESSION_SEC=4*3600,BREAK_SEC=50*60;
const TM=(window.TESTMASTERS||[]).map(q=>Object.assign({legacy:"Testmasters",src:"tm",ptype:q.chapter||"Testmasters",topic:q.chapter||"Testmasters",hb:q.hb||"",solution:q.solution||""},q));
const BANK=window.BANK.map(q=>Object.assign({src:"orig"},q));
const ALL=BANK.concat(TM),byId={};ALL.forEach(q=>{q.sub=subOf(q);byId[q.id]=q});
function subOf(q){const m=/^(\d\.[A-I])/.exec(q.hb||"");if(m&&+m[1][0]===q.spec)return m[1];const m2=new RegExp("("+q.spec+"\\.[A-I])").exec(q.hb||"");return m2?m2[1]:(m?m[1]:q.spec+".?")}
// ---------------- state ----------------
const KEY="peexam_v4";
let S=JSON.parse(localStorage.getItem(KEY)||"null");
if(!S){const old=JSON.parse(localStorage.getItem("pecbt_v1")||"null");S={hist:old?old.hist||[]:[],qs:old?old.qs||{}:{},err:old?old.err||[]:[],srs:old?old.srs||{}:{},study:[]}}
S.guides=S.guides||{};
const GUIDES=window.GUIDES||[],gById={};GUIDES.forEach(g=>gById[g.code]=g);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const $=s=>document.querySelector(s),app=$("#app");
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const pct=x=>Math.round(100*x)+"%";
const hms=s=>{s=Math.max(0,s|0);return [s/3600|0,(s%3600)/60|0,s%60].map(x=>String(x).padStart(2,"0")).join(":")};
// ---------------- grading / records ----------------
function initResp(q){const r={v:null,flag:false,visited:false};if(q.type==="dd")r.order=shuffle(q.options.map((_,i)=>i));if(q.type==="ms")r.v=[];return r}
function answered(q,r){if(!r)return false;if(q.type==="ms")return r.v.length>0;if(q.type==="dd")return !!r.touched;return r.v!==null&&r.v!==""}
function grade(q,r){if(!answered(q,r))return false;if(q.type==="mc"||q.type==="pc")return r.v===q.answer;
 if(q.type==="ms")return r.v.slice().sort().join()==q.answer.slice().sort().join();
 if(q.type==="fib"){const x=parseFloat(String(r.v).replace(/,/g,""));return isFinite(x)&&Math.abs(x-q.answer)<=(q.tol||0.02)*Math.abs(q.answer)}
 if(q.type==="dd")return r.order.join()==q.answer.join();return false}
function record(q,ok,mode){const s=S.qs[q.id]||(S.qs[q.id]={n:0,c:0});s.n++;if(ok)s.c++;s.last=ok?1:0;s.t=Date.now();
 if(!ok){S.err.unshift({id:q.id,t:Date.now(),mode});S.err=S.err.slice(0,800)}
 const now=Date.now(),c=S.srs[q.id];if(!ok)S.srs[q.id]={box:0,due:now,miss:(c?c.miss:0)+1};else if(c){c.box++;if(c.box>=SRSINT.length)delete S.srs[q.id];else c.due=now+SRSINT[c.box]*DAY}}
const srsDue=()=>{const now=Date.now();return Object.entries(S.srs).filter(([id,v])=>byId[id]&&v.due<=now).sort((a,b)=>a[1].due-b[1].due).map(([id])=>byId[id])};
function normCdf(z){const t=1/(1+0.2316419*Math.abs(z)),d=0.3989423*Math.exp(-z*z/2),p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p}
function readiness(){const hs=S.hist.slice(-5);if(!hs.length)return null;const tot=88.5;let E=0,V=0;const per={};
 for(const k in SPECMID){const its=hs.flatMap(h=>h.items).filter(x=>byId[x.id]&&byId[x.id].spec==k);const n=its.length,c=its.filter(x=>x.ok).length,p=(c+1)/(n+2),w=SPECMID[k]/tot;per[k]={n,c,p};E+=w*p;V+=w*w*p*(1-p)/(n+3)+w*p*(1-p)/80}
 const sd=Math.sqrt(V+0.0009);return {E,sd,P:normCdf((E-CUT)/sd),per,exams:hs.length}}
function areaStats(filter){const o={};for(const q of ALL){if(filter&&!filter(q))continue;const k=q.spec;const a=o[k]||(o[k]={tot:0,seen:0,n:0,c:0});a.tot++;const s=S.qs[q.id];if(s){a.seen++;a.n+=s.n;a.c+=s.c}}return o}
function subStats(){const o={};for(const q of ALL){const a=o[q.sub]||(o[q.sub]={tot:0,seen:0,n:0,c:0,orig:0,tm:0});a.tot++;a[q.src==="tm"?"tm":"orig"]++;const s=S.qs[q.id];if(s){a.seen++;a.n+=s.n;a.c+=s.c}}return o}
// ---------------- exam assembly ----------------
function weight(q){let w=1;const s=S.qs[q.id];if(s){w*=s.last===0?2.2:0.55}else w*=1.3;return w}
function pick(pool,n,used,weighted){const out=[];pool=pool.filter(q=>!used.has(q.id));
 while(out.length<n&&pool.length){let i=0;if(weighted){let t=pool.reduce((s,q)=>s+weight(q),0),r=Math.random()*t;for(;i<pool.length-1;i++){r-=weight(pool[i]);if(r<=0)break}}else i=Math.random()*pool.length|0;
  out.push(pool[i]);used.add(pool[i].id);pool.splice(i,1)}return out}
function buildSet(total,weighted){const used=new Set(),alloc={};let sum=0;for(const k in MOCK){alloc[k]=Math.round(total*MOCK[k]/80);sum+=alloc[k]}alloc[5]+=total-sum;
 const qs=[];for(const k in alloc)qs.push(...pick(BANK.filter(q=>q.spec==k),alloc[k],used,weighted));if(qs.length<total)qs.push(...pick(BANK,total-qs.length,used,weighted));return shuffle(qs)}
// ---------------- figures / question renderer ----------------
function renderQ(q,r,show){let h=`<div class="stem">${esc(q.stem)}</div>`;const L="ABCDEFG";
 if(q.image)h+=`<div><img src="${esc(q.image)}" style="max-width:100%;border:1px solid #ccc;margin-bottom:10px"></div>`;
 if(q.type==="mc"||q.type==="ms"){if(q.type==="ms")h+=`<div class="tag"><b>Select all that apply.</b></div>`;
  q.options.forEach((o,i)=>{const sel=q.type==="ms"?r.v.includes(i):r.v===i,corr=q.type==="ms"?q.answer.includes(i):q.answer===i;
   h+=`<div class="opt ${sel?"sel":""} ${show?(corr?"right":(sel?"wrong":"")):""}" data-i="${i}"><input type="${q.type==="ms"?"checkbox":"radio"}" ${sel?"checked":""} tabindex="-1"><span class="letter">${L[i]}</span><span>${esc(o)}</span></div>`})}
 if(q.type==="pc")h+=window.FIG(q,r,show)+`<div class="tag">Click a region of the figure. Selected: ${r.v===null?"none":esc(q.options[r.v])}</div>`;
 if(q.type==="fib")h+=`<div class="fib"><input id="fibin" inputmode="decimal" value="${esc(r.v??"")}" ${show?"disabled":""}> ${esc(q.unit||"")}</div><div class="tag">Type a number.</div>`;
 if(q.type==="dd")h+=`<ul class="dd" id="ddl">${r.order.map(i=>`<li draggable="true" data-i="${i}">${esc(q.options[i])}</li>`).join("")}</ul><div class="tag">Drag the items into the correct order, or click one and use ↑/↓.</div>`;
 if(show)h+=solHTML(q,r);return h}
function correctText(q){return q.type==="mc"||q.type==="pc"?q.options[q.answer]:q.type==="ms"?q.answer.map(i=>q.options[i]).join("; "):q.type==="fib"?(q.display||+q.answer.toPrecision(4))+" "+(q.unit||"")+" (±"+Math.round((q.tol||.02)*100)+"%)":q.answer.map(i=>q.options[i]).join(" → ")}
function solHTML(q,r){const ok=grade(q,r);return `<div class="sol"><div class="${ok?"ok":"bad"}">${ok?"✔ Correct":"✘ Incorrect"}</div><div><b>Answer:</b> ${esc(correctText(q))}</div><div style="margin-top:8px"><b>Worked solution:</b> ${esc(q.solution)}</div>${q.hb?`<div class="tag" style="margin-top:8px"><b>Handbook:</b> ${esc(q.hb)}</div>`:""}${q.ptype?`<div class="tag"><b>Problem type:</b> ${esc(q.ptype)}</div>`:""}</div>`}
function bindQ(root,q,r,show,onchg){if(show)return;
 root.querySelectorAll(".opt").forEach(e=>e.onclick=()=>{const i=+e.dataset.i;if(q.type==="ms")r.v=r.v.includes(i)?r.v.filter(x=>x!==i):[...r.v,i];else r.v=i;onchg()});
 root.querySelectorAll("svg .hot").forEach(e=>e.onclick=()=>{r.v=+e.dataset.i;onchg()});
 const f=root.querySelector("#fibin");if(f){f.oninput=()=>{r.v=f.value};}
 const ul=root.querySelector("#ddl");if(ul){let drag=null,selLi=null;const sync=()=>{r.order=[...ul.children].map(x=>+x.dataset.i);r.touched=true};
  ul.querySelectorAll("li").forEach(li=>{li.ondragstart=()=>{drag=li};li.ondragover=e=>{e.preventDefault();li.classList.add("over")};li.ondragleave=()=>li.classList.remove("over");
   li.ondrop=e=>{e.preventDefault();li.classList.remove("over");if(drag&&drag!==li){ul.insertBefore(drag,li);sync()}};li.onclick=()=>{ul.querySelectorAll("li").forEach(x=>x.style.outline="");li.style.outline="2px solid #1f5fa8";selLi=li}});
  ul.tabIndex=0;ul.onkeydown=e=>{if(!selLi)return;if(e.key==="ArrowUp"&&selLi.previousElementSibling){ul.insertBefore(selLi,selLi.previousElementSibling);sync();e.preventDefault()}if(e.key==="ArrowDown"&&selLi.nextElementSibling){ul.insertBefore(selLi.nextElementSibling,selLi);sync();e.preventDefault()}}}}
// ---------------- handbook (formula) panel ----------------
function hbHTML(){return `<div class="hb" id="hb"><div class="hb-head">📖 Reference Handbook (study summary – original wording, not the NCEES handbook) <span class="x" id="hbx">✕</span></div>
 <div class="hb-body"><div class="hb-side"><input id="hbq" placeholder="Search" autocomplete="off"><div class="hits" id="hbhits"></div><div class="hb-toc" id="hbtoc"></div></div>
 <div class="hb-page" id="hbpage"><div class="hb-sheet" id="hbsheet"></div></div></div></div>`}
function hl(s,t){s=esc(s);if(!t)return s;const re=new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");return s.replace(re,m=>"<mark>"+m+"</mark>")}
function bindHB(){const inp=$("#hbq");if(!inp)return;const go=()=>{const t=inp.value.trim().toLowerCase();let toc="",c="",hits=0;
  window.REF.forEach((sec,si)=>{const its=sec.items.filter(([a,b])=>!t||(sec.s+" "+a+" "+b).toLowerCase().includes(t));if(t&&!its.length)return;hits+=t?its.length:0;
   toc+=`<div data-s="${si}">${esc(sec.s)}${t?` (${its.length})`:""}</div>`;c+=`<h3 id="ref${si}">${esc(sec.s)}</h3>`+its.map(([a,b])=>`<p><b>${hl(a,t)}:</b> ${hl(b,t)}</p>`).join("")});
  $("#hbtoc").innerHTML=toc;$("#hbsheet").innerHTML=c||"<p>No results found.</p>";$("#hbhits").textContent=t?hits+" result(s)":"Bookmarks";
  $("#hbtoc").querySelectorAll("div").forEach(d=>d.onclick=()=>{const e=$("#ref"+d.dataset.s);e&&e.scrollIntoView({block:"start"})})};inp.oninput=go;go()}
// ---------------- calculator (TI-30XS-style) ----------------
const C={expr:"",ans:0,deg:true,second:false,mem:0};
const CKEYS=[["2nd","2nd","c2"],["mode","mode",""],["DEL","del",""],["CLEAR","clr",""],["↵","enter","e"],
 ["x²","^2",""],["√","sqrt(",""],["xʸ","^",""],["1/x","^-1",""],["π","π",""],
 ["sin","sin(",""],["cos","cos(",""],["tan","tan(",""],["ln","ln(",""],["log","log(",""],
 ["eˣ","e^(",""],["10ˣ","10^(",""],["(","(",""],[")",")",""],["÷","÷",""],
 ["7","7","n"],["8","8","n"],["9","9","n"],["×","×",""],["EE","E",""],
 ["4","4","n"],["5","5","n"],["6","6","n"],["−","−",""],["ans","ans",""],
 ["1","1","n"],["2","2","n"],["3","3","n"],["+","+",""],["sto→","sto",""],
 ["0","0","n"],[".",".","n"],["(−)","(−)","n"],["rcl","rcl",""],["enter","enter","e"]];
const SECOND={"sin(":"asin(","cos(":"acos(","tan(":"atan(","^2":"^3","sqrt(":"cbrt("};
function calcInit(){$("#ckeys").innerHTML=CKEYS.map(([l,v,c])=>`<button data-v="${esc(v)}" class="${c}">${l}</button>`).join("");
 $("#ckeys").onclick=e=>{const v=e.target.dataset&&e.target.dataset.v;if(v)calcKey(v)};
 const w=$("#calc"),bar=w.querySelector(".calc-bar");bar.onmousedown=e=>{const ox=e.clientX-w.offsetLeft,oy=e.clientY-w.offsetTop;document.onmousemove=m=>{w.style.left=m.clientX-ox+"px";w.style.top=m.clientY-oy+"px";w.style.right="auto"};document.onmouseup=()=>document.onmousemove=null};
 document.addEventListener("keydown",e=>{if($("#calc").classList.contains("hidden")||/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
  const map={"Enter":"enter","Backspace":"del","Escape":"clr","*":"×","/":"÷","-":"−"};const k=map[e.key]||(/^[0-9.+()^]$/.test(e.key)?e.key:null);if(k){e.preventDefault();calcKey(k)}});calcShow()}
function calcShow(){$("#cexpr").textContent=C.expr;$("#cind").textContent=(C.deg?"DEG":"RAD")+(C.second?"  2nd":"")}
function calcKey(v){if(v==="2nd"){C.second=!C.second;return calcShow()}
 if(C.second&&SECOND[v])v=SECOND[v];C.second=false;
 if(v==="mode")C.deg=!C.deg;else if(v==="clr"){C.expr="";$("#cres").textContent="0"}else if(v==="del")C.expr=C.expr.slice(0,-1);
 else if(v==="enter"){calcEval()}else if(v==="sto"){C.mem=C.ans;$("#cres").textContent="x="+fmtN(C.mem)}else if(v==="rcl")C.expr+="x";
 else if(v==="(−)")C.expr+="−";else{if(C.done&&/^[+−×÷^]/.test(v))C.expr="ans";else if(C.done)C.expr="";C.expr+=v}
 C.done=v==="enter";calcShow()}
const fmtN=v=>{if(v===0)return "0";const a=Math.abs(v);return a>=1e10||a<1e-9?v.toExponential(6).replace("e","E"):String(+v.toPrecision(10))};
function calcEval(){try{let x=C.expr.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-").replace(/π/g,"(pi)").replace(/\^/g,"**").replace(/(\d)E(-?\d)/g,"$1e$2").replace(/\bx\b/g,"(mem)");
  if(/[^0-9+\-*/().e\sa-z]/i.test(x))throw 0;const f=k=>C.deg?k*Math.PI/180:k,g=k=>C.deg?k*180/Math.PI:k;
  const v=Function("sin","cos","tan","asin","acos","atan","sqrt","cbrt","ln","log","pi","ans","mem","\"use strict\";return ("+x+")")(t=>Math.sin(f(t)),t=>Math.cos(f(t)),t=>Math.tan(f(t)),t=>g(Math.asin(t)),t=>g(Math.acos(t)),t=>g(Math.atan(t)),Math.sqrt,Math.cbrt,Math.log,Math.log10,Math.PI,C.ans,C.mem);
  if(typeof v!=="number"||!isFinite(v))throw 0;C.ans=v;$("#cres").textContent=fmtN(v)}catch(e){$("#cres").textContent="SYNTAX ERROR"}}
window.__calc={key:calcKey,C};
const toggleCalc=()=>{$("#calc").classList.toggle("hidden");const b=$("#tbCalc");b&&b.classList.toggle("on",!$("#calc").classList.contains("hidden"))};
document.addEventListener("click",e=>{if(e.target.dataset&&e.target.dataset.close){$("#"+e.target.dataset.close).classList.add("hidden");const b=$("#tbCalc");b&&b.classList.remove("on")}});
// ---------------- site shell ----------------
let route="home";
function shell(body){return `<div class="top"><div class="brand">PE Mechanical · Machine Design &amp; Materials · CBT Simulator</div><nav>
 ${[["home","Dashboard"],["guides","Study guides"],["study","Study by section"],["exam","Exam mode"],["errors","Error log"],["tm","Testmasters book"],["about","About"]].map(([k,l])=>`<a data-r="${k}" class="${route===k?"on":""}">${l}</a>`).join("")}</nav></div><div class="wrap">${body}</div>`}
function go(r){route=r;stopTimer();$("#calc").classList.add("hidden");({home:home,guides:guidesPage,exam:examSetup,study:studySetup,errors:errorsPage,tm:tmPage,about:about})[r]();window.scrollTo(0,0)}
function bindNav(){app.querySelectorAll("[data-r]").forEach(a=>a.onclick=()=>go(a.dataset.r))}
function barCls(p){return p<0.55?"lo":p<0.7?"mid":""}
// ---------------- dashboard ----------------
function home(){const R=readiness(),A=areaStats(q=>q.src==="orig"),due=srsDue().length,seen=Object.keys(S.qs).filter(id=>byId[id]).length;
 const tot=Object.values(S.qs).reduce((a,s)=>[a[0]+s.n,a[1]+s.c],[0,0]);
 const rows=Object.keys(SPEC).map(k=>{const a=A[k]||{tot:0,seen:0,n:0,c:0},acc=a.n?a.c/a.n:0,ex=R&&R.per[k];
  return `<tr><td><b>${k}. ${SPEC[k]}</b><div class="muted">Exam: ${SPECRANGE[k]} questions</div></td><td style="width:22%">${a.seen}/${a.tot} seen<div class="bar"><i style="width:${pct(a.seen/a.tot)}"></i></div></td>
  <td style="width:22%">${a.n?pct(acc)+" ("+a.c+"/"+a.n+")":"—"}<div class="bar ${barCls(acc)}"><i style="width:${a.n?pct(acc):0}"></i></div></td><td>${ex&&ex.n?pct(ex.c/ex.n):"—"}</td>
  <td><button class="btn sec" data-studyka="${k}">Study</button></td></tr>`}).join("");
 const last=S.hist.slice(-6).reverse().map(h=>`<tr><td>${new Date(h.t).toLocaleString()}</td><td>${esc(h.mode)}</td><td>${h.items.filter(x=>x.ok).length}/${h.items.length} (${pct(h.items.filter(x=>x.ok).length/h.items.length)})</td></tr>`).join("");
 const tmTile=TM.length?`<div class="card"><h2>📘 Testmasters book</h2><div class="big">${TM.length}</div><div class="muted">problems loaded from your scans</div><button class="btn" data-r="tm">Open</button></div>`
  :`<div class="card tile-tm"><h2>📘 Testmasters book (coming)</h2><p class="muted">Placeholder for the scanned book you send next week. Drop the entries into <code>data/testmasters.js</code> and this tile turns into a study list by chapter.</p><button class="btn sec" data-r="tm">How to add it</button></div>`;
 app.innerHTML=shell(`<div class="grid">
  <div class="card"><h2>Readiness</h2>${R?`<div class="big">${pct(R.P)}</div><div class="muted">Estimated chance of passing, from your last ${R.exams} timed exam(s). Expected score ${pct(R.E)} ± ${pct(R.sd)} against an <b>assumed</b> ${pct(CUT)} cut score (NCEES does not publish one).</div><div class="bar ${barCls(R.E)}" style="margin-top:8px"><i style="width:${pct(R.E)}"></i></div>`:`<div class="big">—</div><div class="muted">Take a timed exam (Exam mode) to get an estimate.</div>`}</div>
  <div class="card"><h2>Spaced review</h2><div class="big">${due}</div><div class="muted">missed questions due today (Leitner intervals 0/1/3/7/14/30 days)</div><button class="btn" id="srsGo" ${due?"":"disabled"}>Review now</button></div>
  <div class="card"><h2>Error log</h2><div class="big">${new Set(S.err.map(e=>e.id)).size}</div><div class="muted">different questions missed</div><button class="btn sec" data-r="errors">Open error log</button></div>
  <div class="card"><h2>Overall</h2><div class="big">${tot[0]?pct(tot[1]/tot[0]):"—"}</div><div class="muted">${seen} of ${ALL.length} questions seen · ${tot[0]} attempts</div><button class="btn" data-r="exam">Start exam</button><button class="btn sec" data-r="study">Study</button></div>
  <div class="card"><h2>📗 Study guides</h2><div class="big">${GUIDES.filter(g=>S.guides[g.code]&&S.guides[g.code].read).length}/${GUIDES.length}</div><div class="muted">guides read. Learn the subsection first, then take its quiz.</div><button class="btn" data-r="guides">Open guides</button></div>
  ${tmTile}</div>
  <div class="card" style="margin-top:16px"><h2>Progress by 2025 MDM knowledge area</h2><table class="t"><tr><th>Knowledge area</th><th>Coverage</th><th>Accuracy (all modes)</th><th>Recent exams</th><th></th></tr>${rows}</table></div>
  <div class="card" style="margin-top:16px"><h2>Recent exams</h2>${last?`<table class="t"><tr><th>Date</th><th>Mode</th><th>Score</th></tr>${last}</table>`:`<p class="muted">No exams yet.</p>`}</div>`);
 bindNav();const sg=$("#srsGo");if(sg)sg.onclick=()=>startStudy(srsDue(),"Spaced review");
 app.querySelectorAll("[data-studyka]").forEach(b=>b.onclick=()=>{route="study";studySetup(+b.dataset.studyka)})}
// ---------------- exam setup ----------------
function examSetup(){app.innerHTML=shell(`<div class="grid">
 <div class="card"><h2>Full exam: 2 sessions × 40</h2><p>80 questions, 4 h per session, optional 50-min break between sessions. Questions lean toward your weak and unseen items, with area counts matched to the 2025 spec.</p><button class="btn" data-ex="full">Start full exam</button></div>
 <div class="card"><h2>Final Mock 80</h2><p>Random draw (not adaptive), with area counts set to the 2025 spec midpoints: BEP 13 · MoM 20 · Attachments 10 · Power Transmission 10 · Components 18 · Supportive 9.</p><button class="btn" data-ex="mock">Start Final Mock</button></div>
 <div class="card"><h2>Single session (40)</h2><p>One 4-hour session, the same as half of exam day.</p><button class="btn" data-ex="half">Start session</button></div>
 <div class="card"><h2>Quick timed set (10)</h2><p>10 questions in 60 min (6 min each, about the exam pace).</p><button class="btn" data-ex="quick">Start quick set</button></div></div>
 <div class="card" style="margin-top:16px"><h2>How the real CBT works (and this simulator)</h2><ul>
 <li>The real exam has 80 questions in two sections, with a scheduled break between them. Once you submit section 1 you cannot go back to it. The simulator enforces this.</li>
 <li>Toolbar: <b>Flag for Review</b>, <b>Reference Handbook</b> (searchable split-screen panel), <b>Calculator</b>. Bottom bar: <b>Previous</b>, <b>Review Screen</b>, <b>Next</b>.</li>
 <li>The review screen lists every question as Complete or Incomplete, with flags. You can filter by All, Incomplete, or Flagged, then End Section.</li>
 <li>Question types: multiple choice, multiple correct (select all), numeric entry, point-and-click on a figure, and drag-and-drop ordering.</li>
 <li>Hotkeys: Alt+N next · Alt+P previous · Alt+F flag · Alt+R review · Alt+C calculator · Alt+H handbook.</li></ul>
 <p class="muted">The panel here is a summary of formulas in original wording, not the NCEES handbook. On exam day you get the official MDM Reference Handbook PDF, so practice searching that too.</p></div>`);
 bindNav();app.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>startExam(b.dataset.ex))}
// ---------------- exam runtime ----------------
let E=null,timer=null;
function stopTimer(){if(timer){clearInterval(timer);timer=null}}
function startExam(kind){let sessions,label;
 if(kind==="full"){const a=buildSet(80,true);sessions=[a.slice(0,40),a.slice(40)];label="Full exam (2×40)"}
 else if(kind==="mock"){const a=buildSet(80,false);sessions=[a.slice(0,40),a.slice(40)];label="Final Mock 80"}
 else if(kind==="half"){sessions=[buildSet(40,true)];label="Single session (40)"}
 else{sessions=[buildSet(10,true)];label="Quick timed set (10)"}
 const resp={};sessions.flat().forEach(q=>resp[q.id]=initResp(q));
 E={kind,label,sessions,si:0,idx:0,resp,left:kind==="quick"?3600:SESSION_SEC,view:"q",filter:null,hb:false,start:Date.now()};
 if(window.__TEST_FAST)E.left=window.__TEST_FAST;
 renderExam();stopTimer();timer=setInterval(tick,1000)}
function tick(){if(!E||E.view==="break")return;E.left--;const t=$("#tmr");if(t){t.textContent=hms(E.left);t.classList.toggle("low",E.left<900)}if(E.left<=0){stopTimer();modal("Time expired","The time for this section is up. Your answers have been saved.",[["OK",()=>endSection()]])}}
const curQs=()=>E.sessions[E.si];
function visibleIdx(){const qs=curQs();if(!E.filter)return qs.map((_,i)=>i);return qs.map((q,i)=>i).filter(i=>E.filter==="flag"?E.resp[qs[i].id].flag:!answered(qs[i],E.resp[qs[i].id]))}
function cbtFrame(inner,opts){const qs=curQs(),n=qs.length,ns=E.sessions.length;
 return `<div class="cbt"><div class="cbt-head"><span class="title">NCEES PE Mechanical: Machine Design and Materials (practice)</span><div class="right">${opts.qinfo||""}<span>Section ${E.si+1} of ${ns}</span><span>Time Remaining <span class="timer ${E.left<900?"low":""}" id="tmr">${hms(E.left)}</span></span></div></div>
 <div class="cbt-tools">${opts.tools||""}<span class="sp"></span><button class="tb ${E.hb?"on":""}" id="tbHB"><span class="ico">📖</span>Reference Handbook</button><button class="tb ${$("#calc").classList.contains("hidden")?"":"on"}" id="tbCalc"><span class="ico">🖩</span>Calculator</button></div>
 <div class="cbt-main">${E.hb?hbHTML():""}${inner}</div><div class="cbt-foot">${opts.foot}</div></div>`}
function renderExam(){const qs=curQs(),q=qs[E.idx],r=E.resp[q.id];r.visited=true;E.view="q";const vis=visibleIdx(),pos=vis.indexOf(E.idx);
 const hasPrev=E.filter?pos>0:E.idx>0,hasNext=E.filter?pos>=0&&pos<vis.length-1:E.idx<qs.length-1;
 app.innerHTML=cbtFrame(`<div class="qpane" id="qpane"><div class="qnum">Question ${E.idx+1} of ${qs.length}${E.filter?` <span class="pill">Reviewing ${E.filter==="flag"?"flagged":"incomplete"}</span>`:""}</div><div id="qbody">${renderQ(q,r,false)}</div></div>`,
  {qinfo:`<span>${qs.filter(x=>answered(x,E.resp[x.id])).length} of ${qs.length} answered</span>`,
   tools:`<label class="flagbox ${r.flag?"on":""}" id="flag"><input type="checkbox" ${r.flag?"checked":""}><span class="f">⚑</span> Flag for Review</label>`,
   foot:`<button class="nb" id="prev" ${hasPrev?"":"disabled"}>◀ Previous</button><span class="sp"></span><button class="nb" id="rev">Review Screen</button><span class="sp"></span><button class="nb" id="next">${hasNext?"Next ▶":"Review ▶"}</button>`});
 bindTools();
 const rebind=()=>{$("#qbody").innerHTML=renderQ(q,r,false);bindQ($("#qbody"),q,r,false,rebind);updAnswered()};bindQ($("#qbody"),q,r,false,rebind);
 $("#flag").onclick=e=>{e.preventDefault();r.flag=!r.flag;$("#flag").classList.toggle("on",r.flag);$("#flag").querySelector("input").checked=r.flag};
 $("#prev").onclick=()=>{if(E.filter){if(pos>0)E.idx=vis[pos-1]}else E.idx--;renderExam()};
 $("#next").onclick=()=>{if(!hasNext)return renderReview();if(E.filter)E.idx=vis[pos+1];else E.idx++;renderExam()};
 $("#rev").onclick=renderReview;const f=$("#fibin");if(f)f.focus()}
function updAnswered(){const qs=curQs(),el=document.querySelector(".cbt-head .right span");if(el)el.textContent=`${qs.filter(x=>answered(x,E.resp[x.id])).length} of ${qs.length} answered`}
function bindTools(){$("#tbHB").onclick=()=>{E.hb=!E.hb;E.view==="q"?renderExam():renderReview()};$("#tbCalc").onclick=toggleCalc;const x=$("#hbx");if(x)x.onclick=()=>{E.hb=false;E.view==="q"?renderExam():renderReview()};bindHB()}
function renderReview(){E.view="review";const qs=curQs(),inc=qs.filter(q=>!answered(q,E.resp[q.id])).length,fl=qs.filter(q=>E.resp[q.id].flag).length;
 app.innerHTML=cbtFrame(`<div class="rv"><h2>Review Screen</h2><div class="legend">Click a question to go to it. <b>${inc}</b> incomplete · <b>${fl}</b> flagged · ${qs.length-inc} complete.</div>
 <div class="rv-grid">${qs.map((q,i)=>{const r=E.resp[q.id],a=answered(q,r);return `<div class="rv-item" data-i="${i}"><span class="fl">${r.flag?"⚑":""}</span><span>Question ${i+1}</span><span class="st ${a?"":"inc"}">${a?"Complete":r.visited?"Incomplete":"Unseen"}</span></div>`}).join("")}</div>
 <div class="legend">⚑ = flagged for review</div></div>`,
 {foot:`<button class="nb" id="rall">Review All</button><button class="nb" id="rinc" ${inc?"":"disabled"}>Review Incomplete</button><button class="nb" id="rfl" ${fl?"":"disabled"}>Review Flagged</button><span class="sp"></span><button class="nb" id="endS" style="background:linear-gradient(#ffe9d6,#f3b98a)">End Section</button>`});
 bindTools();app.querySelectorAll(".rv-item").forEach(d=>d.onclick=()=>{E.filter=null;E.idx=+d.dataset.i;renderExam()});
 const startF=f=>{E.filter=f;const v=visibleIdx();if(!v.length)return;E.idx=v[0];renderExam()};
 $("#rall").onclick=()=>startF(null);$("#rinc").onclick=()=>startF("inc");$("#rfl").onclick=()=>startF("flag");
 $("#endS").onclick=()=>modal("End Section?",`You have ${inc} incomplete question(s)${fl?` and ${fl} flagged`:""}. Once you end this section you <b>cannot return</b> to it.`,[["Return to Review",null],["End Section",endSection]])}
function modal(title,html,btns){const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="box"><h3>${title}</h3><p>${html}</p><div style="text-align:right">${btns.map((b,i)=>`<button class="btn ${i?"":"sec"}" data-i="${i}">${b[0]}</button>`).join("")}</div></div>`;
 document.body.appendChild(m);m.querySelectorAll("button").forEach(b=>b.onclick=()=>{m.remove();const f=btns[+b.dataset.i][1];f&&f()})}
function endSection(){stopTimer();if(E.si<E.sessions.length-1){E.si++;E.idx=0;E.filter=null;E.left=SESSION_SEC;if(window.__TEST_FAST)E.left=window.__TEST_FAST;breakScreen()}else finishExam()}
function breakScreen(){E.view="break";let b=BREAK_SEC;app.innerHTML=`<div class="cbt"><div class="cbt-head"><span class="title">Scheduled Break</span></div><div class="rv" style="text-align:center;padding-top:80px">
 <h2>Section 1 is complete</h2><p>You can take an optional break of up to 50 minutes. Section 2's timer starts when you begin it.</p><div class="big" id="brk">${hms(b)}</div><br>
 <button class="btn" id="skip">Begin Section 2</button></div></div>`;
 const bt=setInterval(()=>{b--;const el=$("#brk");if(!el||b<=0){clearInterval(bt);if(el)begin()}else el.textContent=hms(b)},1000);
 const begin=()=>{clearInterval(bt);renderExam();stopTimer();timer=setInterval(tick,1000)};$("#skip").onclick=begin}
function finishExam(){stopTimer();const qs=E.sessions.flat(),items=qs.map(q=>{const ok=grade(q,E.resp[q.id]);record(q,ok,E.label);return {id:q.id,ok}});
 S.hist.push({t:Date.now(),mode:E.label,items,dur:Math.round((Date.now()-E.start)/1000)});save();results(qs,items)}
function results(qs,items){const c=items.filter(x=>x.ok).length,per={};qs.forEach((q,i)=>{const p=per[q.spec]||(per[q.spec]={n:0,c:0});p.n++;if(items[i].ok)p.c++});
 app.innerHTML=shell(`<div class="card"><h2>Results: ${esc(E.label)}</h2><div class="big">${c}/${qs.length} · ${pct(c/qs.length)}</div><p class="muted">Practice only. NCEES reports pass/fail plus a diagnostic by area. The ${pct(CUT)} line used here is assumed.</p>
 <table class="t"><tr><th>Knowledge area</th><th>Score</th><th style="width:40%"></th></tr>${Object.keys(per).sort().map(k=>`<tr><td>${k}. ${SPEC[k]}</td><td>${per[k].c}/${per[k].n}</td><td><div class="bar ${barCls(per[k].c/per[k].n)}"><i style="width:${pct(per[k].c/per[k].n)}"></i></div></td></tr>`).join("")}</table>
 <button class="btn" data-r="home">Dashboard</button><button class="btn sec" id="retryMiss">Study the ones I missed</button></div>
 <div class="card" style="margin-top:16px"><h2>Question review</h2>${qs.map((q,i)=>`<details style="border-bottom:1px solid #e3e9f1;padding:6px 0"><summary>${items[i].ok?"✔":"✘"} Q${i+1} · ${esc(q.sub)} ${esc(SUBNAMES[q.sub]||"")} · ${esc(q.topic)}${E.resp[q.id].flag?" ⚑":""}</summary><div style="padding:8px 4px">${renderQ(q,E.resp[q.id],true)}</div></details>`).join("")}</div>`);
 bindNav();$("#retryMiss").onclick=()=>startStudy(qs.filter((q,i)=>!items[i].ok),"Missed in "+E.label)}
// ---------------- study by section ----------------
function studySetup(preKA){const st=subStats(),subs={};ALL.forEach(q=>{(subs[q.spec]=subs[q.spec]||new Set()).add(q.sub)});
 const kaHTML=Object.keys(SPEC).map(k=>{const list=[...(subs[k]||[])].sort();const tot=list.reduce((a,s)=>a+st[s].tot,0);
  return `<details class="ka" ${preKA==k?"open":""}><summary><input type="checkbox" class="kachk" data-k="${k}" ${preKA==k?"checked":""}> ${k}. ${SPEC[k]} <span class="muted">(${tot} questions · exam ${SPECRANGE[k]})</span></summary>
  ${list.map(s=>{const a=st[s];const acc=a.n?pct(a.c/a.n):"—";return `<label><input type="checkbox" class="subchk" data-k="${k}" value="${s}" ${preKA==k?"checked":""}> <b>${s}</b> ${esc(SUBNAMES[s]||"Other")}${a.tm?` <span class="pill">TM ${a.tm}</span>`:""}<span class="muted">${a.tot} Qs · ${a.seen} seen · acc ${acc}</span>${gById[s]?`<button class="btn sec gbtn" data-guide="${s}" style="margin:0 0 0 8px;padding:3px 10px">${S.guides[s]&&S.guides[s].read?"✔ ":""}Study guide</button>`:""}</label>`}).join("")}</details>`}).join("");
 app.innerHTML=shell(`<div class="card"><h2>Study by section (2025 MDM specification)</h2><p class="muted">Pick knowledge areas or subsections. You get immediate feedback and a worked solution after every question. Untimed.</p>${kaHTML}
 <h3>Options</h3><label>Questions: <select id="sn"><option>10</option><option selected>20</option><option>40</option><option value="9999">All matching</option></select></label> &nbsp;
 <label>Filter: <select id="sf"><option value="all">All</option><option value="unseen">Unseen only</option><option value="missed">Previously missed</option><option value="weak">Weakest first</option></select></label> &nbsp;
 <label>Source: <select id="ss"><option value="all">All</option><option value="orig">Original bank</option><option value="tm" ${TM.length?"":"disabled"}>Testmasters book${TM.length?"":" (coming)"}</option></select></label><br>
 <div style="margin-top:8px">Types: ${["mc","ms","fib","pc","dd"].map(t=>`<label style="margin-right:10px"><input type="checkbox" class="tchk" value="${t}" checked> ${({mc:"Multiple choice",ms:"Select all",fib:"Numeric entry",pc:"Point & click",dd:"Drag & drop"})[t]}</label>`).join("")}</div>
 <button class="btn" id="sgo">Start studying</button><button class="btn sec" id="sall">Select all</button><span class="muted" id="scount"></span></div>`);
 bindNav();app.querySelectorAll("[data-guide]").forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();openGuide(b.dataset.guide)});const upd=()=>{$("#scount").textContent=" "+studyPool().length+" matching questions"};
 app.querySelectorAll(".kachk").forEach(c=>c.onclick=e=>{e.stopPropagation();app.querySelectorAll(`.subchk[data-k="${c.dataset.k}"]`).forEach(s=>s.checked=c.checked);upd()});
 app.querySelectorAll(".subchk,.tchk").forEach(c=>c.onchange=upd);["#sf","#ss"].forEach(s=>$(s).onchange=upd);
 $("#sall").onclick=()=>{app.querySelectorAll(".kachk,.subchk").forEach(c=>c.checked=true);upd()};
 $("#sgo").onclick=()=>{let p=studyPool();if(!p.length)return alert("No questions match. Select at least one subsection.");const f=$("#sf").value;
  p=f==="weak"?p.sort((a,b)=>accOf(a)-accOf(b)):shuffle(p);startStudy(p.slice(0,+$("#sn").value),"Study")};upd()}
const accOf=q=>{const s=S.qs[q.id];return s?(s.c+0.5)/(s.n+1):0.5};
function studyPool(){const subs=new Set([...app.querySelectorAll(".subchk:checked")].map(c=>c.value)),types=new Set([...app.querySelectorAll(".tchk:checked")].map(c=>c.value)),f=$("#sf").value,src=$("#ss").value;
 return ALL.filter(q=>subs.has(q.sub)&&types.has(q.type)&&(src==="all"||q.src===src)&&(f!=="unseen"||!S.qs[q.id])&&(f!=="missed"||(S.qs[q.id]&&S.qs[q.id].c<S.qs[q.id].n)))}
let ST=null;
function startStudy(qs,label){if(!qs.length)return alert("Nothing to study here yet.");ST={qs,label,i:0,ok:0,done:0,r:initResp(qs[0]),shown:false};renderStudy()}
function renderStudy(){const q=ST.qs[ST.i],r=ST.r;
 app.innerHTML=shell(`<div class="card" style="padding:0;overflow:hidden"><div class="cbt-head"><span class="title">${esc(ST.label)}: question ${ST.i+1} of ${ST.qs.length}</span><div class="right"><span>Score ${ST.ok}/${ST.done}</span></div></div>
 <div class="cbt-tools"><span class="pill">${q.spec}. ${esc(SPEC[q.spec])}</span><span class="pill">${esc(q.sub)} ${esc(SUBNAMES[q.sub]||"")}</span><span class="pill">${esc(q.topic)}</span>${q.src==="tm"?'<span class="pill">Testmasters</span>':""}<span class="sp"></span>${gById[q.sub]?`<button class="tb" id="sGuide">📗 Guide ${q.sub}</button>`:""}<button class="tb" id="sHB">📖 Handbook</button><button class="tb" id="tbCalc">🖩 Calculator</button></div>
 <div class="cbt-main" style="min-height:420px"><div id="shb" class="hidden" style="display:flex">${hbHTML()}</div><div class="qpane"><div id="qbody">${renderQ(q,r,ST.shown)}</div></div></div>
 <div class="cbt-foot"><button class="nb" id="squit">End session</button><span class="sp"></span>${ST.shown?`<button class="nb" id="snext">${ST.i<ST.qs.length-1?"Next ▶":"Finish"}</button>`:`<button class="nb" id="ssub">Submit answer</button>`}</div></div>`);
 bindNav();bindHB();const shb=$("#shb");$("#sHB").onclick=()=>shb.classList.toggle("hidden");$("#hbx").onclick=()=>shb.classList.add("hidden");$("#tbCalc").onclick=toggleCalc;
 const rebind=()=>{$("#qbody").innerHTML=renderQ(q,r,false);bindQ($("#qbody"),q,r,false,rebind)};bindQ($("#qbody"),q,r,ST.shown,rebind);
 $("#squit").onclick=()=>studyDone();const sg=$("#sGuide");if(sg)sg.onclick=()=>openGuide(q.sub);
 if(!ST.shown)$("#ssub").onclick=()=>{if(!answered(q,r))return alert("Answer the question first.");const ok=grade(q,r);record(q,ok,"study");ST.done++;if(ok)ST.ok++;save();ST.shown=true;renderStudy()};
 else $("#snext").onclick=()=>{if(ST.i>=ST.qs.length-1)return studyDone();ST.i++;ST.r=initResp(ST.qs[ST.i]);ST.shown=false;renderStudy()}}
function studyDone(){S.study.push({t:Date.now(),label:ST.label,n:ST.done,c:ST.ok});save();
 app.innerHTML=shell(`<div class="card"><h2>${esc(ST.label)} complete</h2><div class="big">${ST.ok}/${ST.done}</div><p class="muted">Missed questions were added to spaced review and the error log.</p><button class="btn" data-r="study">Study more</button><button class="btn sec" data-r="home">Dashboard</button></div>`);bindNav()}
// ---------------- study guides ----------------
function guidesPage(){const st=subStats(),read=GUIDES.filter(g=>S.guides[g.code]&&S.guides[g.code].read).length;
 const by={};GUIDES.forEach(g=>(by[g.area]=by[g.area]||[]).push(g));
 app.innerHTML=shell(`<div class="card"><h2>Study guides: learn, then quiz</h2><p class="muted">One guide for each 2025 MDM subsection, 1.A–6.F. Read the guide (key ideas → formulas → handbook keywords → worked examples → traps → cheat sheet), then press <b>Take section quiz</b>. Guides marked ★ cover your focus areas: statics/dynamics, mechanics of materials, materials, vibration and basic engineering practice.</p>
 <div class="bar" style="max-width:420px"><i style="width:${pct(read/GUIDES.length)}"></i></div><div class="muted">${read} of ${GUIDES.length} read · <a href="guides_pdf/MDM_Study_Guides_All.pdf" target="_blank">Combined PDF</a></div></div>
 ${Object.keys(by).map(k=>`<div class="card" style="margin-top:14px"><h2>${k}. ${SPEC[k]} <span class="muted">(exam ${SPECRANGE[k]} questions)</span> <a class="muted" style="font-weight:normal" href="guides_pdf/MDM_Study_Guide_Area_${k}.pdf" target="_blank">PDF</a></h2><table class="t">
 ${by[k].map(g=>{const r=S.guides[g.code]||{},a=st[g.code]||{tot:0,n:0,c:0};return `<tr><td style="width:46%">${g.weak?"★ ":""}<b>${g.code}</b> ${esc(g.title)}</td><td>${r.read?`<span class="pill" style="background:#d8f0de">✔ Read ${new Date(r.t).toLocaleDateString()}</span>`:r.opened?'<span class="pill">Opened</span>':'<span class="pill" style="background:#fbe6e3">Not read</span>'}</td><td class="muted">${a.tot} Qs · acc ${a.n?pct(a.c/a.n):"—"}</td>
 <td><button class="btn" data-guide="${g.code}">Study guide</button><button class="btn sec" data-quiz="${g.code}" ${a.tot?"":"disabled"}>Quiz</button></td></tr>`}).join("")}</table></div>`).join("")}`);
 bindNav();app.querySelectorAll("[data-guide]").forEach(b=>b.onclick=()=>openGuide(b.dataset.guide));app.querySelectorAll("[data-quiz]").forEach(b=>b.onclick=()=>sectionQuiz(b.dataset.quiz))}
function guideHTML(g){return `<div class="guide"><div class="tag">${g.area}. ${esc(SPEC[g.area])} ${g.weak?'· <b>★ focus area</b>':""}</div><h1 style="margin:4px 0 12px;color:#13294b">${g.code} ${esc(g.title)}</h1>
 <h3>1. Key concepts</h3><ul>${g.concepts.map(c=>`<li>${esc(c)}</li>`).join("")}</ul>
 <h3>2. Essential formulas</h3><table class="t"><tr><th>Name</th><th>Formula</th><th>Variables / units</th></tr>${g.formulas.map(([a,b,c])=>`<tr><td>${esc(a)}</td><td style="font-family:Cambria,Georgia,serif;font-size:15px">${esc(b)}</td><td class="muted">${esc(c)}</td></tr>`).join("")}</table>
 <h3>3. Handbook search keywords</h3><div>${g.keywords.map(k=>`<span class="pill">${esc(k)}</span>`).join(" ")}</div><div class="muted" style="margin-top:4px">Type these in the search box of the NCEES MDM Reference Handbook PDF (the exam has no Ctrl+F).</div>
 <h3>4. Worked examples</h3>${g.examples.map((e,i)=>`<div class="sol" style="margin-top:10px"><b>Example ${i+1}: ${esc(e.title)}</b><p>${esc(e.problem)}</p><ol>${e.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol><div><b>Answer:</b> ${esc(e.answer)}</div></div>`).join("")}
 <h3>5. Common traps</h3><ul>${g.traps.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>
 <h3>6. Cheat summary</h3><div class="cheat">${g.cheat.map(c=>`<div>▸ ${esc(c)}</div>`).join("")}</div></div>`}
function openGuide(code){const g=gById[code];if(!g)return;route="guides";const r=S.guides[code]=S.guides[code]||{};r.opened=Date.now();save();const n=ALL.filter(q=>q.sub===code).length;
 app.innerHTML=shell(`<div class="card">${guideHTML(g)}<div style="margin-top:18px;padding-top:12px;border-top:2px solid #e3e9f1">
 <button class="btn sec" id="gread">${r.read?"✔ Marked as read":"Mark as read"}</button><button class="btn" id="gquiz" ${n?"":"disabled"}>Take section quiz → (${Math.min(n,10)} of ${n} questions)</button><button class="btn sec" id="gback">All guides</button><a class="btn sec" style="text-decoration:none" href="guides_pdf/MDM_Study_Guide_Area_${g.area}.pdf" target="_blank">PDF</a></div></div>`);
 bindNav();$("#gread").onclick=()=>{r.read=true;r.t=Date.now();save();$("#gread").textContent="✔ Marked as read"};
 $("#gquiz").onclick=()=>{if(!r.read){r.read=true;r.t=Date.now();save()}sectionQuiz(code)};$("#gback").onclick=()=>go("guides");window.scrollTo(0,0)}
function sectionQuiz(code){const pool=ALL.filter(q=>q.sub===code);const unseen=shuffle(pool.filter(q=>!S.qs[q.id])),seen=shuffle(pool.filter(q=>S.qs[q.id])).sort((a,b)=>accOf(a)-accOf(b));
 startStudy(unseen.concat(seen).slice(0,10),"Section quiz "+code+" "+(gById[code]?gById[code].title:""))}
// ---------------- error log ----------------
function errorsPage(){const m={};S.err.forEach(e=>{if(!byId[e.id])return;const x=m[e.id]||(m[e.id]={id:e.id,n:0,t:e.t,modes:new Set()});x.n++;x.modes.add(e.mode)});
 const list=Object.values(m).sort((a,b)=>b.t-a.t),by={};list.forEach(x=>{const q=byId[x.id];by[q.sub]=(by[q.sub]||0)+1});
 app.innerHTML=shell(`<div class="card"><h2>Error log</h2><p class="muted">Every question you missed, newest first. A question leaves spaced review after you answer it correctly at 1, 3, 7, 14, and 30 days.</p>
 <div>${Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([s,n])=>`<span class="pill">${s} ${esc(SUBNAMES[s]||"")}: ${n}</span>`).join(" ")}</div>
 <button class="btn" id="eall" ${list.length?"":"disabled"}>Retry all missed (${list.length})</button><button class="btn sec" id="esrs">Spaced review due (${srsDue().length})</button>
 <table class="t" style="margin-top:12px"><tr><th>Question</th><th>Section</th><th>Times missed</th><th>Last missed</th><th>Stats</th></tr>
 ${list.map(x=>{const q=byId[x.id],s=S.qs[x.id]||{n:0,c:0};return `<tr><td><a href="#" data-one="${esc(x.id)}">${esc(x.id)}</a> · ${esc(q.topic)}</td><td>${esc(q.sub)} ${esc(SUBNAMES[q.sub]||"")}</td><td>${x.n}</td><td>${new Date(x.t).toLocaleDateString()}</td><td>${s.c}/${s.n}</td></tr>`}).join("")}</table></div>`);
 bindNav();$("#eall").onclick=()=>startStudy(shuffle(list.map(x=>byId[x.id])),"Error log retry");$("#esrs").onclick=()=>startStudy(srsDue(),"Spaced review");
 app.querySelectorAll("[data-one]").forEach(a=>a.onclick=e=>{e.preventDefault();startStudy([byId[a.dataset.one]],"Error log")})}
// ---------------- Testmasters placeholder ----------------
function tmPage(){if(!TM.length){app.innerHTML=shell(`<div class="card tile-tm"><h2>📘 Testmasters book (coming)</h2>
 <p>This section is ready for your scanned Testmasters book. Nothing is loaded yet.</p><ol>
 <li>Scan the book and put the page images in <code>testmasters/img/</code>.</li>
 <li>Add the problems to <code>data/testmasters.js</code> (the format is at the top of that file), or send the scans to Grok Bot to build it.</li>
 <li>Reload this page. The problems show up here by chapter, and in <b>Study by section</b> under their 2025 spec area, with source "Testmasters book".</li></ol>
 <p class="muted">The scanned content is for your own study only. Keep it local and do not share it. The simulator's own bank stays 100% original.</p></div>`);return bindNav()}
 const ch={};TM.forEach(q=>(ch[q.chapter||"Unsorted"]=ch[q.chapter||"Unsorted"]||[]).push(q));
 app.innerHTML=shell(`<div class="card"><h2>📘 Testmasters book</h2><p class="muted">${TM.length} problems from your scans. For personal study only.</p><table class="t"><tr><th>Chapter</th><th>Problems</th><th>Seen</th><th></th></tr>
 ${Object.entries(ch).map(([c,qs],i)=>`<tr><td>${esc(c)}</td><td>${qs.length}</td><td>${qs.filter(q=>S.qs[q.id]).length}</td><td><button class="btn sec" data-ch="${i}">Study</button></td></tr>`).join("")}</table><button class="btn" id="tmall">Study all (shuffled)</button></div>`);
 bindNav();const keys=Object.keys(ch);app.querySelectorAll("[data-ch]").forEach(b=>b.onclick=()=>startStudy(ch[keys[+b.dataset.ch]],"Testmasters: "+keys[+b.dataset.ch]));$("#tmall").onclick=()=>startStudy(shuffle(TM),"Testmasters book")}
function about(){const types={};BANK.forEach(q=>types[q.type]=(types[q.type]||0)+1);
 app.innerHTML=shell(`<div class="card"><h2>About this simulator</h2><p>Original question bank: <b>${BANK.length}</b> questions (${Object.entries(types).map(([k,v])=>k+": "+v).join(", ")}). Testmasters entries loaded: ${TM.length}.</p>
 <p>Everything works offline. Progress is saved in this browser's localStorage, so use the same browser and the same file location. Export or import a backup below.</p>
 <button class="btn sec" id="exp">Export progress</button><label class="btn sec">Import progress<input type="file" id="imp" accept=".json" hidden></label><button class="btn warn" id="rst">Reset all progress</button>
 <p class="muted">The interface is modeled on the publicly described NCEES/Pearson VUE CBT layout (toolbar, flag, review screen, handbook split screen, on-screen calculator). It is not affiliated with NCEES or Pearson VUE. The questions and formula summaries are original. No NCEES, Testmasters, PPI, or other publisher questions are included.</p></div>`);
 bindNav();$("#exp").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:"application/json"}));a.download="pe-exam-sim-progress.json";a.click()};
 $("#imp").onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{S=JSON.parse(t);save();go("home")})};
 $("#rst").onclick=()=>{if(confirm("Erase all progress?")){S={hist:[],qs:{},err:[],srs:{},study:[]};save();go("home")}}}
// ---------------- hotkeys ----------------
document.addEventListener("keydown",e=>{if(!e.altKey||!E||!document.querySelector(".cbt")||E.view==="break")return;const k=e.key.toLowerCase();const click=id=>{const b=$(id);if(b&&!b.disabled){e.preventDefault();b.click()}};
 if(k==="n")click("#next");if(k==="p")click("#prev");if(k==="f")click("#flag");if(k==="r")click("#rev");if(k==="c")click("#tbCalc");if(k==="h")click("#tbHB")});
window.addEventListener("beforeunload",e=>{if(E&&timer){e.preventDefault();e.returnValue=""}});
calcInit();go("home");
window.__T={openGuide,sectionQuiz,GUIDES,get E(){return E},get S(){return S},grade,answered,ALL,BANK,TM,subOf,endSection,finishExam,go,startExam,renderReview};
})();
