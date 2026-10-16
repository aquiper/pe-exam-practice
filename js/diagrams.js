// Original parametric SVG engineering diagrams. Every function returns an SVG string.
// The numbers and labels passed in are drawn on the figure. Colors use CSS variables with fallbacks.
(function(){
const C={ink:"var(--dg-ink,#1d2a3a)",blue:"var(--dg-blue,#2563c9)",red:"var(--dg-red,#d4483b)",green:"var(--dg-green,#2f9e6a)",orange:"var(--dg-orange,#e08a1e)",fill:"var(--dg-fill,#dce8f7)",fill2:"var(--dg-fill2,#f3e3c9)",grey:"var(--dg-grey,#8a96a6)",bg:"var(--dg-bg,#ffffff)"};
const r1=x=>Math.round(x*10)/10;
const fm=(x,n=3)=>{if(x===undefined||x===null||isNaN(x))return "";const a=Math.abs(x);if(a>=1000)return Math.round(x).toLocaleString("en-US");return String(+x.toPrecision(n))};
const esc=s=>String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
function Sv(w,h,body,title){return `<svg class="dg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(title||"diagram")}" style="max-width:${w}px;width:100%;height:auto;font-family:Arial,Helvetica,sans-serif">${title?`<title>${esc(title)}</title>`:""}${body}</svg>`}
const Ln=(x1,y1,x2,y2,c=C.ink,w=2,d="")=>`<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${c}" stroke-width="${w}" ${d?`stroke-dasharray="${d}"`:""}/>`;
const Tx=(x,y,s,o={})=>`<text x="${r1(x)}" y="${r1(y)}" font-size="${o.fs||13}" fill="${o.c||C.ink}" text-anchor="${o.a||"middle"}" ${o.b?'font-weight="bold"':""} ${o.it?'font-style="italic"':""}>${esc(s)}</text>`;
const Rc=(x,y,w,h,f=C.fill,s=C.ink,sw=1.5,rx=0)=>`<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${f}" stroke="${s}" stroke-width="${sw}" rx="${rx}"/>`;
const Ci=(x,y,r,f="none",s=C.ink,sw=2,d="")=>`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="${f}" stroke="${s}" stroke-width="${sw}" ${d?`stroke-dasharray="${d}"`:""}/>`;
const Pa=(d,f="none",s=C.ink,sw=2,extra="")=>`<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${sw}" ${extra}/>`;
function Ar(x1,y1,x2,y2,c=C.red,w=2.5,lab,o={}){const a=Math.atan2(y2-y1,x2-x1),h=10;const p=[[x2,y2],[x2-h*Math.cos(a-0.4),y2-h*Math.sin(a-0.4)],[x2-h*Math.cos(a+0.4),y2-h*Math.sin(a+0.4)]];
 let s=Ln(x1,y1,x2-6*Math.cos(a),y2-6*Math.sin(a),c,w)+`<polygon points="${p.map(q=>q.map(r1).join(",")).join(" ")}" fill="${c}"/>`;
 if(lab)s+=Tx(o.lx!==undefined?o.lx:(o.end?x2:x1)+(o.dx||0),o.ly!==undefined?o.ly:(o.end?y2:y1)+(o.dy||-6),lab,{c,b:1,fs:o.fs||13,a:o.a});return s}
function dim(x1,y1,x2,y2,lab,off=0){const a=Math.atan2(y2-y1,x2-x1),nx=-Math.sin(a)*off,ny=Math.cos(a)*off;const X1=x1+nx,Y1=y1+ny,X2=x2+nx,Y2=y2+ny;
 return Ln(x1,y1,X1,Y1,C.grey,1)+Ln(x2,y2,X2,Y2,C.grey,1)+Ar((X1+X2)/2,(Y1+Y2)/2,X1,Y1,C.grey,1.2)+Ar((X1+X2)/2,(Y1+Y2)/2,X2,Y2,C.grey,1.2)+Tx((X1+X2)/2-Math.sin(a)*12,(Y1+Y2)/2+Math.cos(a)*12+4,lab,{c:C.ink,fs:12})}
const pin=(x,y)=>`<polygon points="${x},${y} ${x-12},${y+18} ${x+12},${y+18}" fill="${C.fill2}" stroke="${C.ink}" stroke-width="1.5"/>`+Ln(x-16,y+19,x+16,y+19,C.ink,2);
const roller=(x,y)=>Ci(x,y+8,8,C.fill2,C.ink,1.5)+Ln(x-16,y+17,x+16,y+17,C.ink,2);
const wall=(x,y1,y2,side=-1)=>{let s=Ln(x,y1,x,y2,C.ink,3);for(let y=y1;y<y2;y+=10)s+=Ln(x,y,x+side*8,y+8,C.grey,1);return s};
const ground=(x1,x2,y)=>{let s=Ln(x1,y,x2,y,C.ink,2.5);for(let x=x1;x<x2;x+=10)s+=Ln(x,y,x-8,y+8,C.grey,1);return s};
const D={};
// ---------- statics / dynamics ----------
D.fbdIncline=({theta=30,mu,m,label="block",showFriction=true,up=true}={})=>{const th=theta*Math.PI/180,x0=40,y0=230,len=330;
 const x1=x0+len*Math.cos(th),y1=y0-len*Math.sin(th),cx=x0+len*0.55*Math.cos(th),cy=y0-len*0.55*Math.sin(th);
 const ux=Math.cos(th),uy=-Math.sin(th),nx=Math.sin(th),ny=Math.cos(th);const bw=60,bh=40;
 const pts=[[cx-ux*bw/2,cy-uy*bw/2],[cx+ux*bw/2,cy+uy*bw/2],[cx+ux*bw/2-nx*bh,cy+uy*bw/2-ny*bh],[cx-ux*bw/2-nx*bh,cy-uy*bw/2-ny*bh]];
 const gx=cx-nx*bh/2,gy=cy-ny*bh/2;let s=`<polygon points="${x0},${y0} ${r1(x1)},${y0} ${r1(x1)},${r1(y1)}" fill="${C.fill2}" stroke="${C.ink}" stroke-width="2"/>`;
 s+=`<polygon points="${pts.map(p=>p.map(r1).join(",")).join(" ")}" fill="${C.fill}" stroke="${C.ink}" stroke-width="2"/>`;
 s+=Ar(gx,gy,gx,gy+80,C.red,2.5,"W = mg",{end:1,dy:16});s+=Ar(cx,cy,cx-nx*90,cy-ny*90,C.blue,2.5,"N",{end:1,dx:-10});
 if(showFriction)s+=Ar(cx+ux*bw/2,cy+uy*bw/2,cx+ux*(bw/2+75),cy+uy*(bw/2+75),C.green,2.5,mu!==undefined?`F = μN (μ=${mu})`:"F (friction)",{end:1,dy:-8});
 s+=Pa(`M ${x0+50} ${y0} A 50 50 0 0 0 ${r1(x0+50*Math.cos(th))} ${r1(y0-50*Math.sin(th))}`,"none",C.ink,1.5)+Tx(x0+66,y0-10,`θ = ${theta}°`,{a:"start"});
 if(m)s+=Tx(gx,gy+4,`${m}`,{fs:12,b:1});return Sv(420,270,s,"Free-body diagram, block on incline")};
D.fbdLadder=({theta=60,W="W"}={})=>{const th=theta*Math.PI/180,x0=110,y0=240,Lp=200,x1=x0+0,tx=x0+Lp*Math.cos(th),ty=y0-Lp*Math.sin(th);
 let s=ground(30,330,y0)+wall(x0+Lp*Math.cos(th),20,y0,1);s+=Ln(x0,y0,tx,ty,C.orange,7);
 s+=Ar((x0+tx)/2,(y0+ty)/2,(x0+tx)/2,(y0+ty)/2+70,C.red,2.5,`W = ${W}`,{end:1,dy:16});s+=Ar(x0,y0,x0,y0-75,C.blue,2.5,"N_floor",{end:1,dx:-8});
 s+=Ar(x0,y0,x0+60,y0,C.green,2.5,"F = μN",{end:1,dy:18});s+=Ar(tx,ty,tx-70,ty,C.blue,2.5,"N_wall (smooth)",{end:1,dy:-8});
 s+=Pa(`M ${x0+40} ${y0} A 40 40 0 0 0 ${r1(x0+40*Math.cos(th))} ${r1(y0-40*Math.sin(th))}`,"none",C.ink,1.5)+Tx(x0+58,y0-12,`${theta}°`,{a:"start"});return Sv(360,270,s,"Ladder free-body diagram")};
D.trussApex=({P=10000,theta=40,unit="lb"}={})=>{const th=theta*Math.PI/180,ax=210,ay=60,span=150;const ly=ay+span*Math.tan(th);
 let s=Ln(ax-span,ly,ax,ay,C.blue,5)+Ln(ax+span,ly,ax,ay,C.blue,5)+pin(ax-span,ly)+pin(ax+span,ly)+Ci(ax,ay,6,C.bg);
 s+=Ar(ax,ay-55,ax,ay-8,C.red,3,`P = ${fm(P)} ${unit}`,{dx:0,dy:-4});s+=Tx(ax-span/2-30,(ay+ly)/2,"F",{c:C.blue,b:1})+Tx(ax+span/2+30,(ay+ly)/2,"F",{c:C.blue,b:1});
 s+=Pa(`M ${ax-span+45} ${ly} A 45 45 0 0 0 ${r1(ax-span+45*Math.cos(th))} ${r1(ly-45*Math.sin(th))}`,"none",C.ink,1.5)+Tx(ax-span+62,ly-8,`${theta}°`,{a:"start"});
 s+=Tx(ax,ly+45,"Joint at apex: 2F·sinθ = P",{fs:13,it:1});return Sv(420,Math.min(ly+60,330),s,"Two-member frame with apex load")};
function vmPlot(xs,V,M,x0,w,top,unitV,unitM,Lmax){// draws V and M diagrams from sampled arrays
 const vmax=Math.max(...V.map(Math.abs))||1,mmax=Math.max(...M.map(Math.abs))||1,hV=55,hM=60;const X=x=>x0+x/Lmax*w;
 let s=Tx(x0-28,top+hV/2+4,"V",{b:1,c:C.blue})+Ln(x0,top+hV/2,x0+w,top+hV/2,C.grey,1);
 let pv=`M ${X(0)} ${top+hV/2}`;xs.forEach((x,i)=>pv+=` L ${r1(X(x))} ${r1(top+hV/2-V[i]/vmax*hV/2)}`);pv+=` L ${X(Lmax)} ${top+hV/2} Z`;s+=Pa(pv,"rgba(37,99,201,.18)",C.blue,2);
 const iv=V.indexOf(Math.max(...V));s+=Tx(X(xs[iv])+4,top+6,`+${fm(Math.max(...V))} ${unitV}`,{a:"start",fs:11,c:C.blue});const mn=Math.min(...V);if(mn<0){const j=V.indexOf(mn);s+=Tx(X(xs[j])-4,top+hV+4,`${fm(mn)} ${unitV}`,{a:"end",fs:11,c:C.blue})}
 const tm=top+hV+20;s+=Tx(x0-28,tm+hM/2,"M",{b:1,c:C.red})+Ln(x0,tm+(M.some(m=>m<0)&&!M.some(m=>m>0)?0:hM),x0+w,tm+(M.some(m=>m<0)&&!M.some(m=>m>0)?0:hM),C.grey,1);
 const base=M.some(m=>m<0)&&!M.some(m=>m>0)?tm:tm+hM;let pm=`M ${X(0)} ${base}`;xs.forEach((x,i)=>pm+=` L ${r1(X(x))} ${r1(base-M[i]/mmax*hM)}`);pm+=` L ${X(Lmax)} ${base} Z`;s+=Pa(pm,"rgba(212,72,59,.15)",C.red,2);
 const im=M.map(Math.abs).indexOf(mmax);s+=Tx(X(xs[im]),M[im]>0?base-hM-5:base+hM+14,`M_max = ${fm(Math.abs(M[im]))} ${unitM}`,{fs:11,c:C.red,b:1});return s}
D.beamSS=({L:Lb=12,P=9000,a=4,uL="ft",uP="lb",w}={})=>{const x0=60,W=340,X=x=>x0+x/Lb*W;let s=Rc(x0,60,W,14,C.fill,C.ink,1.5)+pin(x0,74)+roller(x0+W,74);
 let RA,RB,xs=[],V=[],M=[];if(w){RA=RB=w*Lb/2;for(let i=0;i<=60;i++){const x=Lb*i/60;xs.push(x);V.push(RA-w*x);M.push(RA*x-w*x*x/2)}
  for(let i=0;i<=8;i++)s+=Ar(X(Lb*i/8),22,X(Lb*i/8),58,C.red,1.5);s+=Ln(x0,22,x0+W,22,C.red,1.5)+Tx(x0+W/2,15,`w = ${fm(w)} ${uP}/${uL}`,{c:C.red,b:1});}
 else{RA=P*(Lb-a)/Lb;RB=P*a/Lb;const gx=[];for(let i=0;i<=200;i++)gx.push(Lb*i/200);gx.push(a,a);gx.sort((p,q)=>p-q);let ka=0;for(const x of gx){let left=x<a||(x===a&&ka++===0);xs.push(x);V.push(left?RA:RA-P);M.push(left?RA*x:RA*x-P*(x-a))}
  s+=Ar(X(a),12,X(a),58,C.red,3,`P = ${fm(P)} ${uP}`,{dx:8,dy:2,a:"start"});s+=dim(x0,100,X(a),100,`a = ${fm(a)} ${uL}`,0);}
 s+=Ar(x0,128,x0,96,C.blue,2,`R_A = ${fm(RA)}`,{dx:0,dy:44});s+=Ar(x0+W,128,x0+W,96,C.blue,2,`R_B = ${fm(RB)}`,{dx:0,dy:44});
 s+=dim(x0,40,x0+W,40,`L = ${fm(Lb)} ${uL}`,-0).replace(/^/,"");
 s+=vmPlot(xs,V,M,x0,W,160,uP,`${uP}·${uL}`,Lb);return Sv(440,330,s,"Simply supported beam with shear and moment diagrams")};
D.cantilever=({L:Lb=60,P=1000,uL="in",uP="lb",w}={})=>{const x0=60,W=330,X=x=>x0+x/Lb*W;let s=wall(x0,30,110,-1)+Rc(x0,62,W,14);let xs=[],V=[],M=[];
 if(w){for(let i=0;i<=60;i++){const x=Lb*i/60;xs.push(x);V.push(w*(Lb-x));M.push(-w*(Lb-x)**2/2)}for(let i=0;i<=8;i++)s+=Ar(X(Lb*i/8),24,X(Lb*i/8),60,C.red,1.5);s+=Ln(x0,24,x0+W,24,C.red,1.5)+Tx(x0+W/2,17,`w = ${fm(w)} ${uP}/${uL}`,{c:C.red,b:1})}
 else{for(let i=0;i<=60;i++){const x=Lb*i/60;xs.push(x);V.push(P);M.push(-P*(Lb-x))}s+=Ar(x0+W,14,x0+W,60,C.red,3,`P = ${fm(P)} ${uP}`,{a:"end",dx:-6,dy:4})}
 s+=dim(x0,100,x0+W,100,`L = ${fm(Lb)} ${uL}`);s+=Tx(x0+W+12,74,"δ_max",{a:"start",fs:11,c:C.grey});s+=vmPlot(xs,V,M,x0,W,140,uP,`${uP}·${uL}`,Lb);return Sv(440,310,s,"Cantilever with shear and moment diagrams")};
D.tSection=({b1=6,t1=1,b2=1.5,h2=6,u="in"}={})=>{const sc=150/Math.max(b1,h2+t1),cx=180,yb=230;const A1=b1*t1,A2=b2*h2,yc=(A1*(h2+t1/2)+A2*h2/2)/(A1+A2);
 let s=Rc(cx-b2*sc/2,yb-h2*sc,b2*sc,h2*sc)+Rc(cx-b1*sc/2,yb-(h2+t1)*sc,b1*sc,t1*sc);s+=Ln(cx-b1*sc/2-30,yb-yc*sc,cx+b1*sc/2+30,yb-yc*sc,C.red,1.5,"6 4")+Tx(cx+b1*sc/2+34,yb-yc*sc+4,`ȳ = ${fm(yc)} ${u}`,{a:"start",c:C.red,b:1});
 s+=dim(cx-b1*sc/2,yb-(h2+t1)*sc,cx+b1*sc/2,yb-(h2+t1)*sc,`${b1} ${u}`,-16)+dim(cx+b2*sc/2,yb,cx+b2*sc/2,yb-h2*sc,`${h2} ${u}`,-28)+Tx(cx-b2*sc/2-8,yb-h2*sc/2,`${b2}`,{a:"end",fs:12})+Tx(cx,yb+18,"datum (bottom)",{fs:11,c:C.grey})+Ln(cx-60,yb,cx+60,yb,C.grey,1);
 return Sv(400,260,s,"Composite T-section centroid")};
D.impact=({m1=3,v1=12,m2=8,e=0.8,u="kg",uv="m/s"}={})=>{let s=ground(20,400,150)+Ci(110,120,28,C.fill)+Ci(270,115,36,C.fill2);s+=Tx(110,124,`${m1} ${u}`,{b:1})+Tx(270,119,`${m2} ${u}`,{b:1});
 s+=Ar(150,70,220,70,C.red,3,`v₁ = ${v1} ${uv}`,{dy:-6});s+=Tx(270,64,"at rest",{c:C.grey})+Tx(200,190,`Momentum conserved; e = ${e}`,{it:1});return Sv(420,205,s,"Impact of two bodies")};
D.rolling=({theta=25,body="hoop"}={})=>{const th=theta*Math.PI/180,x0=30,y0=200,len=330,cx=x0+len*.5*Math.cos(th),cy=y0-len*.5*Math.sin(th),r=30;
 const ox=cx-Math.sin(th)*r,oy=cy-Math.cos(th)*r;let s=`<polygon points="${x0},${y0} ${r1(x0+len*Math.cos(th))},${y0} ${r1(x0+len*Math.cos(th))},${r1(y0-len*Math.sin(th))}" fill="${C.fill2}" stroke="${C.ink}" stroke-width="2"/>`;
 s+=Ci(ox,oy,r,body==="hoop"?"none":C.fill,C.ink,body==="hoop"?5:2)+Ar(ox,oy,ox+60*Math.cos(th),oy-60*Math.sin(th)*-1*-1,C.green,2.5,"a",{end:1});
 s+=Tx(200,235,`Rolling ${body}: a = g·sinθ/(1 + I/mr²)`,{it:1});return Sv(420,250,s,"Body rolling without slip")};
// ---------- mechanics of materials ----------
D.mohr=({sx=12,sy=-4,txy=6,u="ksi"}={})=>{const c=(sx+sy)/2,Rr=Math.sqrt(((sx-sy)/2)**2+txy**2),s1=c+Rr,s2=c-Rr;const span=Math.max(Math.abs(s1),Math.abs(s2),Rr)*1.25||1,sc=150/span,ox=220,oy=150;const X=v=>ox+v*sc,Y=v=>oy+v*sc;
 let s=Ln(30,oy,410,oy,C.grey,1)+Ln(ox,15,ox,285,C.grey,1)+Tx(405,oy-6,"σ",{a:"end",b:1})+Tx(ox+8,24,"τ (cw)",{a:"start",fs:11});
 s+=Ci(X(c),oy,Rr*sc,"rgba(37,99,201,.08)",C.blue,2.5);s+=Ln(X(sx),Y(txy),X(sy),Y(-txy),C.orange,2,"5 3");
 s+=Ci(X(sx),Y(txy),5,C.orange,C.orange)+Tx(X(sx)+8,Y(txy)+14,`X(${fm(sx)}, ${fm(txy)})`,{a:"start",fs:11,c:C.orange})+Ci(X(sy),Y(-txy),5,C.orange,C.orange)+Tx(X(sy)-8,Y(-txy)-6,`Y(${fm(sy)}, ${fm(-txy)})`,{a:"end",fs:11,c:C.orange});
 s+=Ci(X(s1),oy,5,C.red,C.red)+Tx(X(s1)+6,oy+16,`σ₁ = ${fm(s1)}`,{a:"start",fs:12,c:C.red,b:1})+Ci(X(s2),oy,5,C.red,C.red)+Tx(X(s2)-6,oy+16,`σ₂ = ${fm(s2)}`,{a:"end",fs:12,c:C.red,b:1});
 s+=Ci(X(c),oy-Rr*sc,5,C.green,C.green)+Tx(X(c),oy-Rr*sc-8,`τ_max = R = ${fm(Rr)}`,{fs:12,c:C.green,b:1})+Tx(X(c),oy+32,`C = ${fm(c)}`,{fs:11});
 s+=Tx(220,298,`Stresses in ${u}`,{fs:11,c:C.grey});return Sv(440,305,s,"Mohr's circle")};
D.columnChart=({hl}={})=>{const cases=[["Pinned–pinned",1.0,"pp"],["Fixed–free",2.0,"ff"],["Fixed–pinned",0.7,"fp"],["Fixed–fixed",0.5,"xx"]];let s="";
 cases.forEach(([n,K,k],i)=>{const x=60+i*100,top=40,bot=220,on=hl&&n.toLowerCase().replace(/[-–]/g,"-")===String(hl).toLowerCase().replace(/[-–]/g,"-");
  if(on)s+=Rc(x-45,18,90,250,"rgba(224,138,30,.12)",C.orange,1.5,8);
  let d=`M ${x} ${bot}`;for(let j=0;j<=40;j++){const t=j/40,y=bot-(bot-top)*t;let dx;if(k==="pp")dx=Math.sin(Math.PI*t)*22;else if(k==="ff")dx=(1-Math.cos(Math.PI*t/2))*30;else if(k==="xx")dx=(1-Math.cos(2*Math.PI*t))*11;else dx=Math.sin(Math.PI*t*1.43)*18*(1-t*.3)*(t<.7?1:1)*(Math.sin(Math.PI*Math.min(t*1.43,1)));d+=` L ${r1(x+dx)} ${r1(y)}`}
  s+=Ln(x,top,x,bot,C.grey,1,"4 3")+Pa(d,"none",C.blue,3);s+=(k==="pp"||k==="fp"?"":"")+Ln(x-18,bot+2,x+18,bot+2,C.ink,4);
  if(k==="pp")s+=pin(x,bot-16).replace(/polygon/,"polygon")+Ci(x,top,5,C.bg);if(k==="fp")s+=Ci(x,top,5,C.bg);if(k==="xx")s+=Ln(x-18,top,x+18,top,C.ink,4);
  s+=Ar(x,top-28,x,top-6,C.red,2.5);s+=Tx(x,bot+26,n,{fs:11,b:1})+Tx(x,bot+42,`K = ${K}`,{fs:12,c:C.orange,b:1})});
 s+=Tx(210,300,"P_cr = π²EI/(KL)²: smaller K → higher buckling load",{fs:12,it:1});return Sv(420,310,s,"Column end conditions and effective length factors")};
D.axialBar=({segs=[[12,1.5],[8,1.0]],P=20000,uL="in",uP="lb"}={})=>{const tot=segs.reduce((a,s)=>a+s[0],0),dm=Math.max(...segs.map(s=>s[1])),x0=50,W=310;let x=x0,s=wall(x0,40,160,-1);
 segs.forEach(([l,d])=>{const w=l/tot*W,h=d/dm*70;s+=Rc(x,100-h/2,w,h);s+=Tx(x+w/2,100+h/2+16,`Ø${d} ${uL}`,{fs:12})+dim(x,40,x+w,40,`${l} ${uL}`);x+=w});
 s+=Ar(x,100,x+55,100,C.red,3,`P = ${fm(P)} ${uP}`,{end:1,dy:-10});s+=Tx(210,190,"δ = Σ PL/(AE)",{it:1});return Sv(440,200,s,"Axial bar")};
D.torsionShaft=({d=1,L:Lr=36,T:Tq=17000,u="in",uT="in-lb"}={})=>{let s=wall(40,40,160,-1)+Rc(40,85,300,30,C.fill,C.ink,1.5,4)+`<ellipse cx="340" cy="100" rx="8" ry="15" fill="${C.fill}" stroke="${C.ink}" stroke-width="1.5"/>`;
 s+=Pa("M 352 70 A 34 34 0 1 1 352 130","none",C.red,2.5)+`<polygon points="352,130 362,122 348,118" fill="${C.red}"/>`+Tx(395,80,`T = ${fm(Tq)} ${uT}`,{a:"start",c:C.red,b:1});
 s+=dim(40,140,340,140,`L = ${fm(Lr)} ${u}`)+Tx(190,78,`Ø${fm(d)} ${u}`,{fs:12})+Tx(190,180,"τ = Tc/J = 16T/πd³ ; θ = TL/JG",{it:1});return Sv(520,195,s,"Shaft in torsion")};
D.shearDist=({b=3,h=8,V=9600,shape="rect",u="in",uV="lb"}={})=>{let s="";const cx=110,cy=120;if(shape==="rect"){s+=Rc(cx-b*10,cy-h*11,b*20,h*22,C.fill)}else{s+=Ci(cx,cy,70,C.fill)}
 s+=Ln(cx-90,cy,cx+90,cy,C.grey,1,"5 3")+Tx(cx-92,cy-4,"NA",{a:"end",fs:11});const hh=shape==="rect"?h*11:70;let d=`M 260 ${cy-hh}`;for(let i=0;i<=30;i++){const y=-1+2*i/30;d+=` L ${r1(260+80*(1-y*y))} ${r1(cy+y*hh)}`}d+=` L 260 ${cy+hh}`;
 s+=Ln(260,cy-hh,260,cy+hh,C.ink,1.5)+Pa(d,"rgba(37,99,201,.15)",C.blue,2)+Tx(345,cy+4,`τ_max = ${shape==="rect"?"1.5":"4/3"}·V/A`,{a:"start",c:C.blue,b:1,fs:12});
 s+=Tx(cx,cy+hh+22,shape==="rect"?`${b} × ${h} ${u}`:"solid circle",{fs:12})+Tx(300,cy+hh+22,`V = ${fm(V)} ${uV}`,{fs:12,c:C.red});return Sv(480,cy+hh+40,s,"Transverse shear stress distribution")};
D.thermalBar=({L:Lb=20,gap=0,dT=100,u="in"}={})=>{let s=wall(40,50,150,-1)+wall(380,50,150,1)+Rc(40,85,gap?320:340,30,C.fill2);if(gap)s+=dim(360,70,380,70,`gap ${gap} ${u}`,-6);
 s+=Tx(200,105,`ΔT = +${dT}°`,{b:1,c:C.red})+dim(40,140,gap?360:380,140,`L = ${Lb} ${u}`)+Tx(210,180,gap?"σ = E(αΔTL − gap)/L once the gap closes":"σ = EαΔT (fully restrained)",{it:1});return Sv(420,195,s,"Restrained bar heated")};
D.stressStrain=({Sy=50,Su=70,u="ksi",mark}={})=>{const ox=50,oy=230,X=e=>ox+e*1300,Y=s=>oy-s/Su*170;const ey=0.0025,eu=0.12,ef=0.2;let d=`M ${ox} ${oy} L ${X(ey)} ${Y(Sy)}`;
 for(let i=0;i<=40;i++){const e=ey+(eu-ey)*i/40;d+=` L ${r1(X(e))} ${r1(Y(Sy+(Su-Sy)*Math.sin(Math.PI/2*i/40)))}`}for(let i=1;i<=20;i++){const e=eu+(ef-eu)*i/20;d+=` L ${r1(X(e))} ${r1(Y(Su-(Su*.18)*(i/20)**1.6))}`}
 let s=Ln(ox,oy,ox+300,oy,C.ink,1.5)+Ln(ox,oy,ox,30,C.ink,1.5)+Tx(ox+300,oy+18,"strain ε",{a:"end",fs:12})+Tx(ox-8,36,"σ",{a:"end",b:1})+Pa(d,"none",C.blue,3);
 s+=Ln(X(0.002),oy,X(0.002+ey),Y(Sy),C.grey,1,"4 3")+Tx(X(0.002)+2,oy+14,"0.2%",{fs:10});s+=Ci(X(ey),Y(Sy),5,C.orange,C.orange)+Tx(X(ey)+8,Y(Sy)+16,`Sy = ${Sy} ${u}`,{a:"start",fs:12,c:C.orange,b:1});
 s+=Ci(X(eu),Y(Su),5,C.red,C.red)+Tx(X(eu),Y(Su)-10,`Su = ${Su} ${u}`,{fs:12,c:C.red,b:1})+Ci(X(ef),Y(Su*.82),5,C.ink,C.ink)+Tx(X(ef)-4,Y(Su*.82)-10,"fracture",{fs:11,a:"end"});
 s+=Tx(X(0.001)+16,Y(Sy*.5),"slope E",{a:"start",fs:11,c:C.grey})+`<path d="M ${X(0)} ${oy} L ${X(ey)} ${Y(Sy)} L ${X(ey)} ${oy} Z" fill="rgba(224,138,30,.15)" stroke="none"/>`+Tx(X(ey)+10,oy-8,"resilience",{a:"start",fs:10,c:C.orange});return Sv(380,255,s,"Engineering stress-strain curve")};
D.goodman=({Se=30,Sut=90,Sy,sa,sm,u="ksi"}={})=>{const ox=55,oy=240,sc=290/Sut,X=v=>ox+v*sc,Y=v=>oy-v*sc*(Sut/Se>2.6?0.62*Sut/Se/2.6*1:1);const ys=v=>oy-v/Se*180;
 let s=Ln(ox,oy,ox+320,oy,C.ink,1.5)+Ln(ox,oy,ox,25,C.ink,1.5)+Tx(ox+320,oy+18,"σ_m",{a:"end",b:1})+Tx(ox-8,32,"σ_a",{a:"end",b:1});
 s+=Ln(X(0),ys(Se),X(Sut),oy,C.red,2.5)+Tx(X(0)-6,ys(Se)+4,`Se = ${fm(Se)}`,{a:"end",fs:11,c:C.red})+Tx(X(Sut),oy+16,`Sut = ${fm(Sut)}`,{fs:11,c:C.red});
 let g=`M ${X(0)} ${ys(Se)}`;for(let i=1;i<=30;i++){const m=Sut*i/30;g+=` L ${r1(X(m))} ${r1(ys(Se*(1-(m/Sut)**2)))}`}s+=Pa(g,"none",C.green,2,'stroke-dasharray="6 4"')+Tx(X(Sut*.62),ys(Se*.72),"Gerber",{fs:11,c:C.green});
 if(Sy)s+=Ln(X(0),ys(Math.min(Sy,Se*1.3)),X(Sy),oy,C.grey,1.5,"3 3")+Tx(X(Sy)-4,oy-6,"Langer (Sy)",{a:"end",fs:10,c:C.grey});s+=Tx(X(Sut*.42),ys(Se*.5)+18,"Goodman",{fs:11,c:C.red});
 if(sa!==undefined){s+=Ln(X(0),oy,X(sm*1.6),ys(sa*1.6),C.blue,1.5,"5 3")+Ci(X(sm),ys(sa),6,C.blue,C.blue)+Tx(X(sm)+8,ys(sa)-8,`(σm ${fm(sm)}, σa ${fm(sa)})`,{a:"start",fs:11,c:C.blue,b:1})}
 s+=Tx(200,262,`stresses in ${u}; load line from the origin`,{fs:10,c:C.grey});return Sv(400,270,s,"Fatigue diagram: Goodman and Gerber")};
D.snCurve=({Sut=90,Se=30,sa,f=0.9,u="ksi"}={})=>{const ox=60,oy=220,X=lg=>ox+(lg-3)*80,b=Math.log10(Se/(f*Sut))/3;const Y=s=>oy-(s/(f*Sut))*170;
 let s=Ln(ox,oy,ox+330,oy,C.ink,1.5)+Ln(ox,oy,ox,30,C.ink,1.5);[3,4,5,6,7].forEach(k=>s+=Ln(X(k),oy,X(k),oy+5,C.ink,1)+Tx(X(k),oy+18,`10${["³","⁴","⁵","⁶","⁷"][k-3]}`,{fs:11}));
 s+=Ln(X(3),Y(f*Sut),X(6),Y(Se),C.blue,3)+Ln(X(6),Y(Se),X(7.1),Y(Se),C.blue,3)+Tx(X(3)+6,Y(f*Sut)-8,`${f}Sut = ${fm(f*Sut)}`,{a:"start",fs:11,c:C.blue})+Tx(X(6.5),Y(Se)-8,`Se = ${fm(Se)}`,{fs:11,c:C.blue});
 if(sa){const N=Math.pow(10,3+Math.log10(sa/(f*Sut))/b);if(N>1e3&&N<1e6){s+=Ln(ox,Y(sa),X(Math.log10(N)),Y(sa),C.red,1.5,"4 3")+Ln(X(Math.log10(N)),Y(sa),X(Math.log10(N)),oy,C.red,1.5,"4 3")+Ci(X(Math.log10(N)),Y(sa),5,C.red,C.red)+Tx(ox-6,Y(sa)+4,fm(sa),{a:"end",fs:11,c:C.red})+Tx(X(Math.log10(N)),oy+34,`N ≈ ${fm(N)}`,{fs:11,c:C.red,b:1})}}
 s+=Tx(ox+165,oy+52,`cycles N (log scale); S in ${u}`,{fs:11,c:C.grey});return Sv(410,280,s,"S-N diagram")};
D.vessel=({D:Dd=36,t=0.5,p=400,u="in",up="psi"}={})=>{let s=Rc(70,60,260,110,C.fill,C.ink,2,55)+Rc(80,70,240,90,C.bg,C.grey,1,45);
 s+=Ar(200,60,200,20,C.red,2.5,"σ_hoop = pD/2t",{end:1,dy:-4})+Ar(330,115,385,115,C.blue,2.5,"σ_long = pD/4t",{end:1,dy:-10,a:"middle"});s+=Tx(200,120,`p = ${fm(p)} ${up}`,{b:1});
 s+=dim(40,60,40,170,`D = ${fm(Dd)} ${u}`)+Tx(200,190,`wall t = ${t} ${u}`,{fs:12});return Sv(440,200,s,"Thin-walled pressure vessel")};
D.thickCyl=({ri=1,ro=1.5,pi:pin_=20000,po=0,u="in"}={})=>{const sc=80/ro;let s=Ci(150,120,ro*sc,C.fill2,C.ink,2)+Ci(150,120,ri*sc,C.bg,C.ink,2);
 if(pin_)for(let k=0;k<8;k++){const a=k*Math.PI/4;s+=Ar(150+Math.cos(a)*ri*sc*.3,120+Math.sin(a)*ri*sc*.3,150+Math.cos(a)*(ri*sc-4),120+Math.sin(a)*(ri*sc-4),C.red,1.5)}
 if(po)for(let k=0;k<8;k++){const a=k*Math.PI/4;s+=Ar(150+Math.cos(a)*(ro*sc+28),120+Math.sin(a)*(ro*sc+28),150+Math.cos(a)*(ro*sc+3),120+Math.sin(a)*(ro*sc+3),C.blue,1.5)}
 s+=Ln(150,120,150+ri*sc,120,C.ink,1)+Tx(150+ri*sc/2,114,`r_i=${ri}`,{fs:11})+Ln(150,120,150,120-ro*sc,C.ink,1)+Tx(156,120-ro*sc+14,`r_o=${ro}`,{a:"start",fs:11});
 s+=Tx(290,80,pin_?`p_i = ${fm(pin_)} psi`:"p_i = 0",{a:"start",c:C.red,b:1})+Tx(290,104,po?`p_o = ${fm(po)} psi`:"p_o = 0",{a:"start",c:C.blue,b:1})+Tx(290,140,"Lamé: σ_t max at the bore",{a:"start",fs:12,it:1});return Sv(460,240,s,"Thick-walled cylinder")};
// ---------- attachments ----------
D.boltJoint=({Fi,P,d,grip,u="in",uP="lb"}={})=>{let s=Rc(80,70,240,36,C.fill)+Rc(80,106,240,36,C.fill2)+Rc(178,40,44,132,C.grey,C.ink,1.5)+Rc(160,22,80,20,C.grey)+Rc(160,172,80,22,C.grey);
 s+=Tx(250,92,"member 1",{fs:11,a:"start"})+Tx(250,128,"member 2",{fs:11,a:"start"});s+=Ar(200,22,200,-0+4,C.red,2.5)+Ar(200,194,200,228,C.red,2.5);
 if(P)s+=Tx(210,14,`P = ${fm(P)} ${uP}`,{a:"start",c:C.red,b:1});if(Fi)s+=Tx(60,60,`preload F_i = ${fm(Fi)} ${uP}`,{a:"start",fs:12,c:C.blue,b:1});
 s+=Tx(330,190,"bolt: k_b, members: k_m",{a:"end",fs:11,c:C.grey})+(grip?dim(340,70,340,142,`grip ${grip} ${u}`):"")+(d?Tx(200,212,`d = ${d} ${u}`,{fs:11}):"");return Sv(420,235,s,"Bolted joint")};
D.jointDiagram=({Fi=9000,C:Cj=0.25,P}={})=>{const ox=50,oy=220,sc=150/(Fi*1.6);let s=Ln(ox,oy,ox+330,oy,C.ink,1.5)+Ln(ox,oy,ox,30,C.ink,1.5)+Tx(ox+330,oy+16,"deflection",{a:"end",fs:11})+Tx(ox-6,36,"F",{a:"end",b:1});
 const xi=150,yi=oy-Fi*sc;s+=Ln(ox,oy,xi+120,yi-120*(Fi*sc/(xi-ox)),C.blue,2.5)+Tx(xi+90,yi-100,"bolt (k_b)",{fs:11,c:C.blue});const km=(Fi*sc)/(xi-ox)*(1-Cj)/Cj;
 const xs=xi+Fi*sc/km;s+=Ln(xi,yi,xs,oy,C.orange,2.5)+Tx(xs-4,oy-8,"members (k_m)",{a:"end",fs:11,c:C.orange});s+=Ci(xi,yi,5,C.ink,C.ink)+Tx(xi-8,yi-8,`F_i = ${fm(Fi)}`,{a:"end",fs:11,b:1});
 const P0=Fi/(1-Cj);s+=Tx(200,248,`C = ${fm(Cj)}; separation at P₀ = F_i/(1−C) = ${fm(P0)}`,{fs:11,c:C.grey});if(P)s+=Tx(200,264,`bolt load at P=${fm(P)}: F_i + CP = ${fm(Fi+Cj*P)}`,{fs:11,c:C.red});return Sv(420,272,s,"Bolted joint force-deflection diagram")};
D.weldTypes=({h,L:Lw,F,u="in"}={})=>{let s="";s+=`<polygon points="40,150 140,150 140,140 40,140" fill="${C.fill}" stroke="${C.ink}"/><polygon points="80,140 90,140 90,60 80,60" fill="${C.fill}" stroke="${C.ink}"/>`;
 s+=`<polygon points="90,140 90,112 118,140" fill="${C.orange}" stroke="${C.ink}"/>`+Ln(90,140,104,126,C.red,2)+Tx(122,118,"throat",{a:"start",fs:11,c:C.red})+Tx(122,132,"0.707h",{a:"start",fs:11,c:C.red})+Tx(90,175,"Fillet weld",{b:1,fs:12});
 s+=`<polygon points="180,150 262,150 262,130 228,130 222,150" fill="${C.fill}" stroke="${C.ink}"/><polygon points="280,150 362,150 362,130 278,130" fill="${C.fill}" stroke="${C.ink}"/>`;
 s+=`<polygon points="262,130 278,130 284,150 256,150" fill="${C.orange}" stroke="${C.ink}"/>`+Tx(270,175,"Groove (CJP) weld",{b:1,fs:12});
 s+=Ln(395,110,470,110,C.ink,2)+Ln(395,110,380,140,C.ink,2)+`<polygon points="425,110 425,94 441,110" fill="none" stroke="${C.ink}" stroke-width="2"/>`+Ci(470,110,6,"none")+Tx(432,135,"symbol below line",{fs:10})+Tx(432,148,"= arrow side",{fs:10})+Tx(432,175,"Weld symbol",{b:1,fs:12});
 if(h)s+=Tx(250,30,`h = ${h} ${u}${Lw?`, L = ${Lw} ${u}`:""}${F?`, F = ${fm(F)} lb`:""}: τ = F/(0.707hL)`,{fs:12,c:C.blue,b:1});return Sv(500,190,s,"Weld types and throat")};
D.weldCircle=({r=1,h=0.25,T:Tq,V,Lm}={})=>{let s=Ci(150,120,r*60,C.fill,C.ink,2)+Ci(150,120,r*60+8,"none",C.orange,6);s+=Tx(150,124,`r = ${r} in`,{fs:12})+Tx(150,120+r*60+30,`fillet h = ${h} in, all around`,{fs:12,c:C.orange});
 if(Tq)s+=Pa("M 240 80 A 90 90 0 0 1 240 160","none",C.red,2.5)+`<polygon points="240,160 250,150 236,148" fill="${C.red}"/>`+Tx(256,124,`T = ${fm(Tq)} in-lb`,{a:"start",c:C.red,b:1});
 if(V)s+=Ar(300,60,300,110,C.red,2.5,`V = ${fm(V)} lb at ${Lm} in`,{dy:-6});s+=Tx(150,25,"Weld treated as a line: J_u = 2πr³, I_u = πr³",{fs:11,it:1});return Sv(440,250,s,"Circular weld group")};
D.eccBolts=({pts=[[-1.5,-1.5],[1.5,-1.5],[-1.5,1.5],[1.5,1.5]],P=2000,e=10}={})=>{const sc=30,ox=130,oy=130;let s=pts.map(([x,y])=>Ci(ox+x*sc,oy-y*sc,9,C.fill2,C.ink,2)).join("")+Ci(ox,oy,3,C.ink,C.ink)+Tx(ox+6,oy+14,"centroid",{a:"start",fs:10,c:C.grey});
 const px=Math.min(ox+e*14,400);if(P)s+=Ln(ox,oy,px,oy,C.grey,1,"4 3")+Ar(px,oy-80,px,oy-10,C.red,3,`P = ${fm(P)} lb`,{dy:-6})+dim(ox,oy+60,px,oy+60,`e = ${e} in`);
 s+=Tx(260,250,"F = P/n (direct) + M·r/Σr² (moment), added as vectors",{fs:11,it:1});return Sv(430,262,s,"Eccentrically loaded bolt group")};
D.keyShaft=({d=1.5,w=0.375,L:Lk=2,T:Tq=4000}={})=>{let s=Ci(110,120,70,C.fill,C.ink,2)+Rc(110-w*40,50-w*40*0.5+0,w*80,w*60,C.orange,C.ink,1.5);s+=Tx(110,124,`Ø${d} in`,{b:1});
 s+=Ar(110,120,110+70*Math.cos(-0.5),120+70*Math.sin(-0.5),C.grey,1)+Ar(130+w*40,62,185,62,C.red,2.5,"F = 2T/d",{end:1,dy:-6,a:"start"});s+=Pa("M 40 170 A 80 80 0 0 0 180 170","none",C.red,2)+Tx(110,215,`T = ${fm(Tq)} in-lb`,{c:C.red,b:1});
 s+=Rc(250,100,140,w*60,C.orange,C.ink,1.5)+dim(250,96,390,96,`L = ${Lk} in`,-10)+Tx(320,100+w*60+18,`key ${w} × ${w} in`,{fs:11});s+=Tx(320,175,"shear: τ = F/(wL)",{fs:11})+Tx(320,192,"bearing: σ = F/(L·h/2)",{fs:11});return Sv(420,230,s,"Shaft with square key")};
D.pinShear=({d=0.625,F=8000,n=2}={})=>{let s=Rc(60,70,90,30,C.fill2)+Rc(60,130,90,30,C.fill2)+Rc(150,100,90,30,C.fill)+Rc(98,60,14,110,C.grey,C.ink,1.5);
 s+=Ar(60,145,15,145,C.red,2.5,`F/2`,{end:1,dy:-6})+Ar(60,85,15,85,C.red,2.5,"F/2",{end:1,dy:-6})+Ar(240,115,295,115,C.red,2.5,`F = ${fm(F)} lb`,{end:1,dy:-8});
 s+=Ln(95,100,120,100,C.blue,1.5,"3 2")+Ln(95,130,120,130,C.blue,1.5,"3 2")+Tx(105,190,`Ø${d} in pin, ${n===2?"double":"single"} shear: τ = F/(${n}A)`,{fs:12,c:C.blue});return Sv(340,205,s,"Pin in double shear (clevis)")};
D.lapJoint=({b=1.5,L:Lj,P=2500,kind="adhesive"}={})=>{let s=Rc(30,90,200,18,C.fill)+Rc(150,108,200,18,C.fill2)+Rc(150,100-0,80,16,kind==="adhesive"?C.orange:"none",C.ink,0);
 s+=Ar(30,99,0+5,99,C.red,2.5)+Ar(350,117,395,117,C.red,2.5,`P = ${fm(P)} lb`,{end:1,dy:-8});s+=dim(150,70,230,70,Lj?`overlap ${fm(Lj)} in`:"overlap L");s+=Tx(200,160,`width b = ${b} in; τ = P/(bL)`,{fs:12,it:1});return Sv(420,180,s,"Single-lap joint")};
// ---------- power transmission ----------
D.gearMesh=({N1=18,N2=54,P=6,phi=20,m}={})=>{const d1=m?N1*m:N1/P,d2=m?N2*m:N2/P,sc=150/(d1+d2),r1_=d1/2*sc,r2_=d2/2*sc,cx1=60+r1_,cx2=cx1+r1_+r2_,cy=130;
 let s=Ci(cx1,cy,r1_,"rgba(37,99,201,.1)",C.blue,2.5)+Ci(cx2,cy,r2_,"rgba(224,138,30,.1)",C.orange,2.5)+Ci(cx1,cy,r1_*Math.cos(phi*Math.PI/180),"none",C.grey,1,"4 3")+Ci(cx2,cy,r2_*Math.cos(phi*Math.PI/180),"none",C.grey,1,"4 3");
 const px=cx1+r1_,a=phi*Math.PI/180;s+=Ln(cx1,cy,cx2,cy,C.grey,1)+Ln(px-70*Math.sin(a)*0+-70*Math.cos(Math.PI/2-a),cy-70*Math.sin(Math.PI/2-a)*-1*-1+0,px+70*Math.cos(Math.PI/2-a),cy+70*Math.sin(Math.PI/2-a),C.red,2)+Ci(px,cy,4,C.red,C.red);
 s+=Tx(cx1,cy+4,`${N1}T`,{b:1,c:C.blue})+Tx(cx2,cy+4,`${N2}T`,{b:1,c:C.orange})+Tx(px+8,cy-r1_*0.2-50,`φ = ${phi}°`,{a:"start",fs:12,c:C.red});
 s+=Tx(px,cy+Math.max(r1_,r2_)+22,m?`module ${m} mm; C = m(N₁+N₂)/2 = ${fm(m*(N1+N2)/2)} mm`:`P = ${P}; d₁ = ${fm(d1)} in, d₂ = ${fm(d2)} in; C = ${fm((d1+d2)/2)} in`,{fs:12});return Sv(Math.max(cx2+r2_+20,320),cy+Math.max(r1_,r2_)+35,s,"Spur gear mesh")};
D.gearForces=({Wt=180,phi=20,psi}={})=>{const Wr=Wt*Math.tan(phi*Math.PI/180);let s=Ci(150,140,80,"rgba(37,99,201,.08)",C.blue,2)+Ci(150,140,4,C.ink,C.ink);
 s+=Ar(150,60,250,60,C.red,3,`W_t = ${fm(Wt)} lb`,{end:1,dy:-8})+Ar(150,60,150,120,C.green,3,`W_r = W_t·tanφ = ${fm(Wr)} lb`,{end:1,dx:6,dy:-4,a:"start"});
 if(psi)s+=Tx(150,250,`helical: W_a = W_t·tanψ = ${fm(Wt*Math.tan(psi*Math.PI/180))} lb (ψ = ${psi}°)`,{fs:12,c:C.orange,b:1});return Sv(400,265,s,"Gear tooth force components")};
D.planetary=({Ns=30,Nr=84}={})=>{const sc=1.4,Rs=Ns*sc,Rr=Nr*sc,Rp=(Rr-Rs)/2,cx=150,cy=140;let s=Ci(cx,cy,Rr,"none",C.ink,6)+Ci(cx,cy,Rs,"rgba(37,99,201,.15)",C.blue,2);
 for(let k=0;k<3;k++){const a=k*2*Math.PI/3-Math.PI/2,px=cx+(Rs+Rp)*Math.cos(a),py=cy+(Rs+Rp)*Math.sin(a);s+=Ci(px,py,Rp-2,"rgba(224,138,30,.15)",C.orange,2)+Ln(cx,cy,px,py,C.green,3)}
 s+=Tx(cx,cy+4,`sun ${Ns}T`,{fs:11,b:1})+Tx(cx+Rr+10,cy,`ring ${Nr}T (fixed)`,{a:"start",fs:11})+Tx(cx,cy+Rr+22,"carrier (green) = output; n_arm = n_sun·N_s/(N_s+N_r)",{fs:11});return Sv(420,cy+Rr+34,s,"Planetary gear train")};
D.bearing=({C:Cr,P,n,type="ball"}={})=>{let s=Ci(150,130,95,C.fill2,C.ink,2)+Ci(150,130,75,C.bg,C.ink,1.5)+Ci(150,130,55,C.bg,C.ink,1.5)+Ci(150,130,38,C.fill,C.ink,2);
 for(let k=0;k<12;k++){const a=k*Math.PI/6,x=150+65*Math.cos(a),y=130+65*Math.sin(a);s+=type==="ball"?Ci(x,y,9,C.grey,C.ink,1.5):`<rect x="${r1(x-7)}" y="${r1(y-7)}" width="14" height="14" transform="rotate(${k*30} ${r1(x)} ${r1(y)})" fill="${C.grey}" stroke="${C.ink}"/>`}
 s+=Tx(150,134,"shaft",{fs:11})+Ar(150,-0+250,150,232,C.red,2.5);s+=Tx(270,90,`${type==="ball"?"ball (a = 3)":"roller (a = 10/3)"}`,{a:"start",b:1})+(Cr?Tx(270,114,`C = ${fm(Cr)} N`,{a:"start",fs:12}):"")+(P?Tx(270,134,`P = ${fm(P)} N`,{a:"start",fs:12,c:C.red}):"")+(n?Tx(270,154,`n = ${fm(n)} rpm`,{a:"start",fs:12}):"");
 s+=Tx(270,184,"L₁₀ = (C/P)^a ×10⁶ rev",{a:"start",fs:12,it:1});return Sv(450,255,s,"Rolling-element bearing")};
D.belt=({D:Db=8,d=5,Cd=36,T1,T2,theta}={})=>{const sc=Math.min(10,260/(Cd+Db)),r2=Db/2*sc,r1_=d/2*sc,x1=40+r1_+10,x2=x1+Cd*sc*0.9,cy=110;
 let s=Ci(x1,cy,r1_,C.fill,C.ink,2)+Ci(x2,cy,r2,C.fill2,C.ink,2);const a=Math.asin((r2-r1_)/(x2-x1));
 s+=Ln(x1-r1_*Math.sin(a),cy-r1_*Math.cos(a),x2-r2*Math.sin(a),cy-r2*Math.cos(a),C.ink,3)+Ln(x1-r1_*Math.sin(a),cy+r1_*Math.cos(a),x2-r2*Math.sin(a),cy+r2*Math.cos(a),C.ink,3);
 s+=Tx(x1,cy+4,`${d}"`,{fs:11})+Tx(x2,cy+4,`${Db}"`,{fs:11})+dim(x1,cy+r2+24,x2,cy+r2+24,`C = ${Cd} in`);
 if(T1)s+=Tx((x1+x2)/2,cy-r2-14,`T₁ = ${fm(T1)} lb (tight)`,{fs:12,c:C.red,b:1});if(T2)s+=Tx((x1+x2)/2,cy+r2+8+50,`T₂ = ${fm(T2)} lb (slack)`,{fs:12,c:C.blue,b:1});
 s+=Tx((x1+x2)/2,cy-r2-34,theta?`wrap θ = ${theta}°; T₁/T₂ = e^(μθ)`:"T₁/T₂ = e^(μθ), θ in radians",{fs:11,it:1});return Sv(Math.max(x2+r2+20,340),cy+r2+70,s,"Belt drive")};
D.bandBrake=({D:Db=18,theta=300,T1=900}={})=>{let s=Ci(150,130,70,C.fill,C.ink,2)+Pa(`M 150 ${130+78} A 78 78 0 1 1 ${r1(150+78*Math.sin(theta*Math.PI/180))} ${r1(130+78*Math.cos(theta*Math.PI/180))}`,"none",C.orange,6);
 s+=Ar(150,208,40,240,C.red,2.5,`T₁ = ${fm(T1)} lb`,{end:1,dy:16})+Tx(150,134,`D = ${Db} in`,{fs:12})+Tx(300,80,`wrap ${theta}°`,{a:"start",b:1})+Tx(300,104,"T = (T₁ − T₂)·D/2",{a:"start",fs:12,it:1});return Sv(440,255,s,"Band brake")};
D.clutch=({D:Do=10,d=6,N=2,F=300}={})=>{let s=Ci(120,120,90,C.fill2,C.ink,2)+Ci(120,120,54,C.bg,C.ink,2);s+=dim(30,230,210,230,`D = ${Do} in`)+dim(66,200,174,200,`d = ${d} in`);
 s+=Tx(300,90,`${N} friction surfaces`,{a:"start",fs:12})+Tx(300,112,`F = ${fm(F)} lb`,{a:"start",fs:12,c:C.red})+Tx(300,140,"uniform wear:",{a:"start",fs:12})+Tx(300,158,"T = NμF(D+d)/4",{a:"start",fs:12,it:1});return Sv(450,250,s,"Disk clutch face")};
D.powerScrew=({dm=1.3,l=0.25,W=8000,dc}={})=>{let s="";for(let i=0;i<8;i++)s+=Pa(`M 140 ${50+i*20} L 220 ${60+i*20}`,"none",C.ink,2);s+=Rc(150,40,60,170,"rgba(37,99,201,.1)",C.ink,1.5);
 s+=Rc(110,20,140,20,C.fill2)+Ar(180,-0+0+15,180,18,C.red,1)+Ar(180,10,180,22,C.red,0.01)+Tx(180,14,`W = ${fm(W)} lb`,{c:C.red,b:1});s+=dim(150,226,210,226,`d_m = ${dm} in`)+Tx(300,90,`lead l = ${l} in`,{a:"start",fs:12})+(dc?Tx(300,112,`collar d_c = ${dc} in`,{a:"start",fs:12}):"");
 s+=Tx(300,140,"T = (W·d_m/2)(l+πμd_m)/(πd_m−μl)",{a:"start",fs:11,it:1})+Tx(300,160,"self-locking if πμd_m > l",{a:"start",fs:11,c:C.grey});return Sv(500,245,s,"Square-thread power screw")};
D.shaftLayout=({W=250,L:Ls=48,d=1.5}={})=>{let s=Rc(40,95,340,18,C.fill,C.ink,1.5,6)+pin(60,113)+pin(360,113)+Rc(195,60,30,88,C.fill2,C.ink,2,3);s+=Ar(210,20,210,58,C.red,2.5,`W = ${fm(W)} lb disk`,{dy:-6});
 s+=dim(60,170,360,170,`bearing span ${Ls} in`)+Tx(210,210,`Ø${d} in shaft; δ = WL³/48EI; n_c = (30/π)√(g/δ)`,{fs:12,it:1});return Sv(420,225,s,"Shaft with central disk")};
D.motor=({hp,n,poles,f=60}={})=>{let s=Rc(60,70,170,100,C.fill,C.ink,2,14)+Rc(230,110,90,18,C.grey,C.ink,1.5,4)+Rc(70,170,150,14,C.fill2);for(let i=0;i<6;i++)s+=Ln(80+i*25,78,80+i*25,162,C.grey,1);
 s+=Tx(145,125,hp!=null?`${hp} hp`:"MOTOR",{b:1,fs:15})+(n!=null?Tx(330,100,`n = ${fm(n)} rpm`,{a:"start",fs:12}):"")+(poles?Tx(330,122,`${poles}-pole, ${f} Hz: n_s = 120f/p`,{a:"start",fs:12}):"")+Tx(330,146,"T = 63,025·hp/n (in-lb)",{a:"start",fs:12,it:1});return Sv(520,200,s,"Electric motor")};
D.flywheel=({I,n1,n2,m,r}={})=>{let s=Ci(140,120,90,C.fill2,C.ink,2)+Ci(140,120,20,C.fill,C.ink,2);for(let k=0;k<6;k++){const a=k*Math.PI/3;s+=Ln(140+20*Math.cos(a),120+20*Math.sin(a),140+88*Math.cos(a),120+88*Math.sin(a),C.grey,3)}
 s+=Pa("M 240 70 A 110 110 0 0 1 240 170","none",C.red,2.5)+`<polygon points="240,170 250,160 236,158" fill="${C.red}"/>`;s+=Tx(270,90,m?`m = ${m} kg, r = ${r} m`:I?`I = ${I} kg·m²`:"",{a:"start",fs:12})+Tx(270,114,n2?`${fm(n1)} → ${fm(n2)} rpm`:n1?`n = ${fm(n1)} rpm`:"",{a:"start",fs:12,c:C.red})+Tx(270,140,"E = ½Iω²",{a:"start",fs:12,it:1});return Sv(440,230,s,"Flywheel / rotor")};
// ---------- components ----------
D.spring=({d=0.148,Dm=1.5,N=8,F}={})=>{let s="",y=40;const x=150,w=60;let pth=`M ${x-w} ${y}`;for(let i=0;i<N*2;i++){y+=180/(N*2);pth+=` L ${i%2?x-w:x+w} ${y}`}s+=Pa(pth,"none",C.blue,4);
 s+=Rc(x-80,25,160,14,C.fill2)+Rc(x-80,222,160,14,C.fill2);if(F)s+=Ar(x,0+2,x,24,C.red,2.5)+Tx(x+10,14,`F = ${fm(F)} lb`,{a:"start",c:C.red,b:1});
 s+=dim(x-w,250,x+w,250,`D = ${Dm} in (mean)`)+Tx(260,90,`wire d = ${d} in`,{a:"start",fs:12})+Tx(260,112,`N_a = ${N} active coils`,{a:"start",fs:12})+Tx(260,140,"k = Gd⁴/(8D³N)",{a:"start",fs:12,it:1})+Tx(260,162,"τ = K·8FD/(πd³)",{a:"start",fs:12,it:1});return Sv(440,275,s,"Helical compression spring")};
D.springMass=({m,k,c,F,arr="single"}={})=>{let s=ground(40,380,250);const spr=(x,y1,y2)=>{let p=`M ${x} ${y1}`;const n=8,h=(y2-y1)/n;for(let i=0;i<n;i++)p+=` L ${x+(i%2?-12:12)} ${y1+h*(i+.5)}`;return Pa(p+` L ${x} ${y2}`,"none",C.blue,2.5)};
 if(arr==="series"){s+=Rc(170,30,80,40,C.fill2)+spr(210,70,155)+Rc(195,155,30,6,C.ink)+spr(210,161,248)+Tx(232,115,"k₁",{a:"start"})+Tx(232,205,"k₂",{a:"start"})+Tx(260,55,m?`m = ${m} kg`:"m",{a:"start",b:1})}
 else if(arr==="parallel"){s+=Rc(150,60,120,40,C.fill2)+spr(175,100,248)+spr(245,100,248)+Tx(150,180,"k₁",{a:"end"})+Tx(270,180,"k₂",{a:"start"})+Tx(210,85,m?`m = ${m} kg`:"m",{b:1})}
 else{s+=Rc(150,60,120,46,C.fill2)+spr(180,106,248);if(c)s+=Rc(230,150,24,50,C.bg,C.ink,1.5)+Ln(242,106,242,165,C.ink,2)+Ln(242,200,242,248,C.ink,2)+Tx(262,180,`c = ${fm(c)}`,{a:"start",fs:12});
  s+=Tx(210,88,m?`m = ${m}`:"m",{b:1})+Tx(160,180,k?`k = ${fm(k)}`:"k",{a:"end",fs:12});if(F)s+=Ar(210,8,210,58,C.red,2.5,`F₀ sin ωt`,{dx:8,a:"start"});}
 s+=Ar(310,80,310,40,C.grey,1.5)+Ar(310,80,310,120,C.grey,1.5)+Tx(318,84,"x",{a:"start",it:1});return Sv(420,265,s,"Spring-mass system")};
D.transmissibility=({r,z=0.1}={})=>{const ox=55,oy=230,X=v=>ox+v/4*320,Y=v=>oy-Math.min(v,5)/5*190;let s=Ln(ox,oy,ox+330,oy,C.ink,1.5)+Ln(ox,oy,ox,30,C.ink,1.5)+Ln(ox,Y(1),ox+320,Y(1),C.grey,1,"4 3")+Tx(ox+322,Y(1)+4,"TR=1",{a:"start",fs:10});
 [0.05,0.2,0.5].forEach((zz,j)=>{let d="";for(let i=0;i<=200;i++){const rr=4*i/200,tr=Math.sqrt((1+(2*zz*rr)**2)/((1-rr*rr)**2+(2*zz*rr)**2));d+=(i?" L ":"M ")+r1(X(rr))+" "+r1(Y(tr))}s+=Pa(d,"none",[C.red,C.blue,C.green][j],2)+Tx(X(1.05),Y([4.9,2.7,1.5][j])-2,`ζ=${zz}`,{a:"start",fs:10,c:[C.red,C.blue,C.green][j]})});
 s+=Ln(X(Math.SQRT2),30,X(Math.SQRT2),oy,C.orange,1.5,"5 3")+Tx(X(Math.SQRT2),oy+16,"√2",{fs:11,c:C.orange})+Tx(X(2.8),Y(2.2),"isolation zone (TR<1)",{fs:11,c:C.orange})+Tx(ox+165,oy+34,"frequency ratio r = ω/ωn",{fs:11});
 if(r){const tr=Math.sqrt((1+(2*z*r)**2)/((1-r*r)**2+(2*z*r)**2));s+=Ci(X(r),Y(tr),6,C.ink,C.ink)+Tx(X(r)+8,Y(tr)-10,`r=${fm(r)}, TR=${fm(tr)}`,{a:"start",fs:11,b:1})}return Sv(410,272,s,"Transmissibility vs frequency ratio")};
D.decay=({x0=10,xn=5,n=4}={})=>{const ox=40,oy=130,zeta=Math.log(x0/xn)/n/(2*Math.PI);let d="";for(let i=0;i<=400;i++){const t=i/400*(n+1.2)*2*Math.PI;d+=(i?" L ":"M ")+r1(ox+i*0.85)+" "+r1(oy-90*Math.exp(-zeta*t)*Math.cos(t))}
 let s=Ln(ox,oy,ox+350,oy,C.grey,1)+Pa(d,"none",C.blue,2);const xp=k=>ox+(k/(n+1.2))*400*0.85,yp=k=>oy-90*Math.exp(-zeta*2*Math.PI*k);
 s+=Ci(xp(0),yp(0),5,C.red,C.red)+Tx(xp(0)+8,yp(0)-4,`x₀ = ${x0}`,{a:"start",fs:11,c:C.red})+Ci(xp(n),yp(n),5,C.red,C.red)+Tx(xp(n)+8,yp(n)-6,`x${n<10?["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"][n]:"n"} = ${xn}`,{a:"start",fs:11,c:C.red});
 s+=Tx(200,245,`δ = (1/n)ln(x₀/xₙ), n = ${n} cycles`,{fs:12,it:1});return Sv(400,255,s,"Free-vibration decay record")};
D.hydCyl=({Db=2.5,d=1.5,p=2000,Q}={})=>{let s=Rc(40,70,240,70,C.fill,C.ink,2,6)+Rc(150,76,14,58,C.grey)+Rc(164,96,200,18,C.grey,C.ink,1.5);s+=Tx(95,110,`p = ${fm(p)} psi`,{fs:12,b:1,c:C.red});
 s+=dim(20,70,20,140,`bore ${Db} in`)+dim(300,92,300,118,`rod ${d} in`,22)+(Q?Ar(10,160,40,130,C.blue,2,`Q = ${Q} gpm`,{dy:14}):"")+Tx(210,175,"F = pA; retract uses A = π(D²−d²)/4; v = Q/A",{fs:11,it:1});return Sv(420,190,s,"Hydraulic cylinder")};
D.ironCarbon=({C0=0.4}={})=>{const ox=50,oy=230,X=c=>ox+c/1.2*320,Y=T_=>oy-(T_-600)/400*190;let s=Ln(ox,oy,ox+330,oy,C.ink,1.5)+Ln(ox,oy,ox,30,C.ink,1.5);
 s+=Pa(`M ${X(0)} ${Y(912)} L ${X(0.76)} ${Y(727)} L ${X(1.2)} ${Y(870)}`,"none",C.blue,2.5)+Ln(X(0.022),Y(727),X(1.2),Y(727),C.ink,2)+Tx(ox+325,Y(727)+4,"727°C",{a:"start",fs:10});
 s+=Tx(X(0.35),Y(860),"γ (austenite)",{fs:12})+Tx(X(0.3),Y(680),"α + pearlite",{fs:11})+Tx(X(1.0),Y(680),"Fe₃C + pearlite",{fs:11});s+=Ln(X(C0),Y(980),X(C0),oy,C.red,2,"5 3")+Tx(X(C0),oy+16,`${C0}% C`,{fs:11,c:C.red,b:1})+Tx(X(0.76),oy+16,"0.76",{fs:10});
 s+=Ln(X(0.022),Y(720),X(0.76),Y(720),C.orange,4)+Tx(X(0.39),Y(705),"lever arms",{fs:10,c:C.orange});return Sv(400,255,s,"Simplified Fe-C diagram, eutectoid region")};
// ---------- BEP / supportive ----------
D.cashflow=({P,A,n=10,F,S:Sal,i}={})=>{const ox=40,w=340,oy=110,X=k=>ox+k/n*w;let s=Ln(ox,oy,ox+w+10,oy,C.ink,2);for(let k=0;k<=n;k++)s+=Ln(X(k),oy-4,X(k),oy+4,C.ink,1)+(k%Math.ceil(n/10)===0||k===n?Tx(X(k),oy+20,k,{fs:10}):"");
 if(P)s+=Ar(X(0),oy,X(0),oy+70,C.red,2.5,`P = $${fm(P)}`,{end:1,dy:16});if(A)for(let k=1;k<=n;k++)s+=Ar(X(k),oy,X(k),oy-(A>0?40:-40),A>0?C.green:C.red,1.8);if(A)s+=Tx(X(n/2),oy-50,`A = $${fm(Math.abs(A))}/yr`,{fs:12,c:C.green,b:1});
 if(F)s+=Ar(X(n),oy,X(n),oy-80,C.blue,2.5,`F = $${fm(F)}`,{end:1,dy:-6});if(Sal)s+=Ar(X(n),oy,X(n),oy-70,C.blue,2.5,`S = $${fm(Sal)}`,{end:1,dy:-6});s+=Tx(ox+w/2,oy+48+20,`end of year (n = ${n}${i?`, i = ${i}%`:""})`,{fs:11,c:C.grey});return Sv(420,200,s,"Cash-flow diagram")};
D.breakeven=({FC=90000,p=45,v=27}={})=>{const N=FC/(p-v),ox=50,oy=220,Nx=N*2,X=q=>ox+q/Nx*320,maxY=p*Nx,Y=y=>oy-y/maxY*190;let s=Ln(ox,oy,ox+330,oy,C.ink,1.5)+Ln(ox,oy,ox,25,C.ink,1.5);
 s+=Ln(X(0),Y(0),X(Nx),Y(p*Nx),C.green,2.5)+Tx(X(Nx)-4,Y(p*Nx)+14,"revenue",{a:"end",fs:11,c:C.green})+Ln(X(0),Y(FC),X(Nx),Y(FC+v*Nx),C.red,2.5)+Tx(X(Nx)-4,Y(FC+v*Nx)+16,"total cost",{a:"end",fs:11,c:C.red})+Ln(X(0),Y(FC),X(Nx),Y(FC),C.grey,1,"4 3")+Tx(ox+4,Y(FC)-4,`fixed $${fm(FC)}`,{a:"start",fs:10});
 s+=Ci(X(N),Y(p*N),6,C.ink,C.ink)+Ln(X(N),Y(p*N),X(N),oy,C.ink,1,"3 3")+Tx(X(N),oy+16,`N = ${fm(N)}`,{fs:12,b:1});return Sv(400,245,s,"Break-even chart")};
D.reliability=({series=[0.95],par=[0.9,0.9],after=[0.98]}={})=>{let s="",x=20;const box=(x,y,t)=>Rc(x,y,64,32,C.fill,C.ink,1.5,5)+Tx(x+32,y+21,t,{fs:12,b:1});
 series.forEach(r=>{s+=box(x,84,`R=${r}`)+Ln(x+64,100,x+84,100);x+=84});s+=Ln(x,100,x,60)+Ln(x,100,x,140)+box(x+10,44,`R=${par[0]}`)+box(x+10,124,`R=${par[1]}`)+Ln(x,60,x+10,60)+Ln(x,140,x+10,140)+Ln(x+74,60,x+90,60)+Ln(x+74,140,x+90,140)+Ln(x+90,60,x+90,140)+Ln(x+90,100,x+110,100);x+=110;
 after.forEach(r=>{s+=box(x,84,`R=${r}`);x+=84});const Rs=series.reduce((a,b)=>a*b,1)*(1-par.reduce((a,b)=>a*(1-b),1))*after.reduce((a,b)=>a*b,1);s+=Tx(x/2+10,200,`R_sys = ${Rs.toFixed(4)}`,{fs:13,b:1,c:C.blue});return Sv(Math.max(x+20,320),215,s,"Reliability block diagram")};
D.gdtTable=()=>{const rows=[["Form","⏥ flatness","— straightness","○ circularity","⌭ cylindricity","no datum"],["Orientation","⊥ perpendicularity","∥ parallelism","∠ angularity","","datum required"],["Location","⌖ position","◎ concentricity","⌯ symmetry","","datum required"],["Runout","↗ circular runout","⌰ total runout","","","datum required"],["Profile","⌒ line profile","⌓ surface profile","","","datum optional"]];
 let s="";rows.forEach((r,i)=>{const y=20+i*38;s+=Rc(10,y,110,34,i%2?C.fill:C.fill2,C.ink,1)+Tx(65,y+22,r[0],{b:1,fs:12});for(let j=1;j<5;j++)s+=Rc(120+(j-1)*112,y,112,34,"none",C.grey,1)+Tx(176+(j-1)*112,y+22,r[j],{fs:11});s+=Tx(580,y+22,r[5],{fs:11,c:r[5]==="no datum"?C.green:C.red,b:1})});
 s+=Rc(130,220,220,30,"none",C.ink,1.5)+Ln(170,220,170,250,C.ink,1)+Ln(260,220,260,250,C.ink,1)+Ln(305,220,305,250,C.ink,1)+Tx(150,240,"⌖",{fs:16})+Tx(215,240,"Ø0.010 Ⓜ",{fs:13})+Tx(282,240,"A",{fs:13,b:1})+Tx(327,240,"B",{fs:13,b:1})+Tx(470,240,"feature control frame",{fs:11,c:C.grey});return Sv(640,262,s,"GD&T symbol families")};
D.fits=({hmin=2.000,hmax=2.001,smin=1.9964,smax=1.998,u="in"}={})=>{const lo=Math.min(hmin,smin),hi=Math.max(hmax,smax),pad=(hi-lo)*0.25||0.001,Y=v=>220-(v-lo+pad)/(hi-lo+2*pad)*180;let s=Ln(40,Y((hmin+smax)/2),360,Y((hmin+smax)/2),C.grey,0);
 s+=Rc(90,Y(hmax),90,Y(hmin)-Y(hmax),"rgba(37,99,201,.25)",C.blue,2)+Tx(135,Y(hmax)-8,"hole",{b:1,c:C.blue})+Rc(230,Y(smax),90,Y(smin)-Y(smax),"rgba(224,138,30,.25)",C.orange,2)+Tx(275,Y(smax)-8,"shaft",{b:1,c:C.orange});
 [[hmax,90],[hmin,90],[smax,320],[smin,320]].forEach(([v,x])=>s+=Tx(x===90?84:326,Y(v)+4,v.toFixed(4),{a:x===90?"end":"start",fs:11}));s+=Tx(205,245,`C_max = ${(hmax-smin).toFixed(4)}, C_min = ${(hmin-smax).toFixed(4)} ${u}`,{fs:12,b:1});return Sv(420,258,s,"Tolerance zones for a fit")};
D.tolStack=({t=[0.002,0.002,0.003,0.002,0.002]}={})=>{let s="",x=20;t.forEach((v,i)=>{const w=60;s+=Rc(x,60,w,50,i%2?C.fill:C.fill2,C.ink,1.5)+Tx(x+w/2,90,`±${v}`,{fs:11});x+=w});
 const wc=t.reduce((a,b)=>a+b,0),rss=Math.sqrt(t.reduce((a,b)=>a+b*b,0));s+=dim(20,130,x,130,"assembly gap");s+=Tx(x/2+10,175,`worst case ±${+wc.toFixed(4)}   |   RSS ±${+rss.toFixed(4)}`,{fs:12,b:1,c:C.blue});return Sv(Math.max(x+30,340),190,s,"Tolerance stack-up")};
D.cpk=({LSL=25,USL=25.1,mu=25.04,s:sd=0.008}={})=>{const lo=Math.min(LSL,mu-4*sd),hi=Math.max(USL,mu+4*sd),X=v=>40+(v-lo)/(hi-lo)*330;let d="";for(let i=0;i<=120;i++){const v=mu-4*sd+8*sd*i/120;d+=(i?" L ":"M ")+r1(X(v))+" "+r1(190-140*Math.exp(-(((v-mu)/sd)**2)/2))}
 let s=Ln(30,190,380,190,C.ink,1.5)+Pa(d,"rgba(37,99,201,.15)",C.blue,2)+Ln(X(LSL),40,X(LSL),195,C.red,2)+Ln(X(USL),40,X(USL),195,C.red,2)+Tx(X(LSL),34,`LSL ${LSL}`,{fs:11,c:C.red})+Tx(X(USL),34,`USL ${USL}`,{fs:11,c:C.red})+Ln(X(mu),45,X(mu),190,C.grey,1,"4 3")+Tx(X(mu),208,`μ = ${mu}`,{fs:11});
 const cpk=Math.min(USL-mu,mu-LSL)/(3*sd);s+=Tx(205,230,`σ = ${sd}; Cpk = ${fm(cpk)}`,{fs:12,b:1});return Sv(410,240,s,"Process capability")};
D.ortho=()=>{let s=Rc(60,140,100,70,C.fill)+Rc(60,40,100,70,C.fill)+Rc(190,140,60,70,C.fill);s+=Ci(110,175,16,"none")+Ln(60,75,160,75,C.grey,1,"5 3")+Ln(190,175,250,175,C.grey,1,"5 3");
 s+=Tx(110,230,"FRONT",{b:1,fs:12})+Tx(110,32,"TOP (above)",{b:1,fs:12})+Tx(220,230,"RIGHT (to the right)",{b:1,fs:12});s+=Tx(330,100,"Third-angle projection",{a:"start",b:1})+Tx(330,122,"(US practice)",{a:"start",fs:11,c:C.grey})+`<g transform="translate(340,150)">${Ci(18,18,14,"none")+Ci(18,18,6,"none")+`<polygon points="40,8 72,0 72,36 40,28" fill="none" stroke="${C.ink}" stroke-width="2"/>`}</g>`;return Sv(480,245,s,"Orthographic views, third-angle projection")};
D.positionTol=({tol=0.010,dx=0.003,dy=0.004,mmc=0.500,act=0.504}={})=>{const bonus=act-mmc,tot=tol+bonus,err=2*Math.hypot(dx,dy),sc=6000;let s=Ci(160,130,tot/2*sc,"rgba(47,158,106,.12)",C.green,2,"6 4")+Ci(160,130,tol/2*sc,"rgba(37,99,201,.12)",C.blue,2);
 s+=Ln(100,130,220,130,C.grey,1)+Ln(160,70,160,190,C.grey,1)+Ci(160+dx*sc,130-dy*sc,5,C.red,C.red)+Tx(166+dx*sc,124-dy*sc,"actual axis",{a:"start",fs:11,c:C.red});
 s+=Tx(290,80,`stated Ø${tol} at MMC`,{a:"start",fs:12,c:C.blue})+Tx(290,102,`bonus ${bonus.toFixed(3)} → Ø${tot.toFixed(3)}`,{a:"start",fs:12,c:C.green})+Tx(290,124,`actual Ø${err.toFixed(3)} (2√(Δx²+Δy²))`,{a:"start",fs:12,c:C.red})+Tx(290,150,err<=tot?"✔ acceptable":"✘ reject",{a:"start",fs:13,b:1,c:err<=tot?C.green:C.red});return Sv(500,230,s,"Position tolerance zone with bonus")};
D.interp=({x1=300,y1=33.2,x2=400,y2=39.7,x=380}={})=>{const y=y1+(y2-y1)*(x-x1)/(x2-x1),X=v=>60+(v-x1)/(x2-x1)*280,Y=v=>200-(v-y1)/(y2-y1)*140;let s=Ln(40,200,370,200,C.ink,1)+Ln(60,30,60,210,C.ink,1)+Ln(X(x1),Y(y1),X(x2),Y(y2),C.blue,2.5);
 s+=Ci(X(x1),Y(y1),5,C.blue,C.blue)+Ci(X(x2),Y(y2),5,C.blue,C.blue)+Ci(X(x),Y(y),6,C.red,C.red)+Ln(X(x),Y(y),X(x),200,C.red,1,"4 3")+Ln(60,Y(y),X(x),Y(y),C.red,1,"4 3");
 s+=Tx(X(x1),216,x1,{fs:11})+Tx(X(x2),216,x2,{fs:11})+Tx(X(x),230,x,{fs:11,c:C.red,b:1})+Tx(54,Y(y1)+4,y1,{a:"end",fs:11})+Tx(54,Y(y2)+4,y2,{a:"end",fs:11})+Tx(54,Y(y)+4,fm(y,4),{a:"end",fs:11,c:C.red,b:1});return Sv(400,240,s,"Linear interpolation")};
D.machining=({D:Dw=2,V=500,f,N}={})=>{let s=Rc(40,90,260,50,C.fill,C.ink,2,4)+`<ellipse cx="300" cy="115" rx="10" ry="25" fill="${C.fill}" stroke="${C.ink}" stroke-width="2"/>`+`<polygon points="200,150 230,150 215,138" fill="${C.orange}" stroke="${C.ink}"/>`+Rc(205,150,20,40,C.orange);
 s+=Pa("M 40 70 A 30 30 0 0 1 80 70","none",C.red,2)+Tx(60,60,"N rpm",{fs:11,c:C.red})+dim(320,90,320,140,`Ø${Dw} in`,22)+Tx(170,215,`V = ${V} sfm; N = 12V/(πD)${N?` = ${fm(N)} rpm`:""}`,{fs:12,it:1});return Sv(420,230,s,"Turning operation")};
D.strainGage=()=>{let s=Rc(60,60,180,90,"none",C.ink,1.5,6);let p="M 80 80";for(let i=0;i<8;i++)p+=` L ${90+i*18} 80 L ${90+i*18} 130 L ${99+i*18} 130 L ${99+i*18} 80`;s+=Pa(p,"none",C.orange,2)+Ar(10,105,55,105,C.red,2)+Ar(290,105,245,105,C.red,2)+Tx(150,175,"ε = (ΔR/R)/GF",{it:1});return Sv(300,190,s,"Strain gage")};
D.galvanic=()=>{const m=[["Magnesium","anodic"],["Zinc",""],["Aluminum",""],["Carbon steel",""],["Copper",""],["Stainless (passive)",""],["Titanium",""],["Graphite","cathodic"]];let s="";m.forEach(([n,t],i)=>{s+=Rc(40,20+i*28,200,24,`rgba(${212-i*20},${72+i*12},${59+i*18},.25)`,C.ink,1,4)+Tx(140,37+i*28,n,{fs:12})});
 s+=Ar(270,40,270,230,C.ink,2)+Tx(280,40,"more anodic (corrodes)",{a:"start",fs:11,c:C.red})+Tx(280,232,"more cathodic (protected)",{a:"start",fs:11,c:C.green});return Sv(460,250,s,"Galvanic series in seawater (simplified)")};
D.pressFit=({d=2,Do=4,L:Lf=2.5,delta=0.002}={})=>{let s=Ci(150,120,Do/2*40,C.fill2,C.ink,2)+Ci(150,120,d/2*40,C.fill,C.ink,2);for(let k=0;k<8;k++){const a=k*Math.PI/4;s+=Ar(150+Math.cos(a)*(d/2*40+18),120+Math.sin(a)*(d/2*40+18),150+Math.cos(a)*(d/2*40+3),120+Math.sin(a)*(d/2*40+3),C.red,1.5)}
 s+=Tx(150,124,`shaft Ø${d}`,{fs:11,b:1})+Tx(150,120-Do/2*40-8,`hub OD ${Do} in`,{fs:11})+Tx(270,90,`interference δ = ${delta} in`,{a:"start",fs:12})+Tx(270,112,`length L = ${Lf} in`,{a:"start",fs:12})+Tx(270,140,"T = πμp d²L/2",{a:"start",fs:12,it:1});return Sv(440,230,s,"Press fit")};
D.pendulum=({L:Lp=1}={})=>{let s=Ln(100,30,240,30,C.ink,3)+Ci(170,30,5,C.bg)+Ln(170,30,220,200,C.orange,8)+Pa("M 170 110 A 80 80 0 0 0 194 107","none",C.ink,1)+Ln(170,30,170,210,C.grey,1,"4 3");s+=Tx(240,130,`L = ${Lp} m`,{a:"start",fs:12})+Tx(240,155,"ωn = √(mgd/I_O) = √(3g/2L)",{a:"start",fs:12,it:1});return Sv(420,220,s,"Compound pendulum")};
D.cantMass=({m=5,L:Lc=1.2,b=40,h=8}={})=>{let s=wall(40,40,140,-1)+Rc(40,86,280,10)+Rc(300,50,44,36,C.fill2);s+=Tx(322,73,`${m} kg`,{fs:11,b:1})+dim(40,120,320,120,`L = ${Lc} m`)+Tx(180,160,`section ${b} × ${h} mm; k = 3EI/L³`,{fs:12,it:1});return Sv(380,175,s,"Cantilever carrying a mass")};
D.chain=({N=25,p=0.5,n}={})=>{let s=Ci(120,110,70,C.fill,C.ink,2);for(let k=0;k<N;k++){const a=k*2*Math.PI/N;s+=Ci(120+76*Math.cos(a),110+76*Math.sin(a),4,C.grey,C.ink,1)}
 s+=Tx(120,114,`${N} teeth`,{b:1,fs:12})+Tx(230,90,`pitch p = ${p} in`,{a:"start",fs:12})+(n?Tx(230,112,`n = ${fm(n)} rpm`,{a:"start",fs:12}):"")+Tx(230,140,"V = N·p·n/12 ft/min",{a:"start",fs:12,it:1});return Sv(420,200,s,"Roller-chain sprocket")};
D.rivetRow=({n=6,d=0.625,t=0.375,P}={})=>{let s=Rc(30,60,330,50,C.fill)+Rc(60,85,330,50,C.fill2,C.ink,1.5);for(let i=0;i<Math.min(n,8);i++)s+=Ci(90+i*38,98,d*14,C.grey,C.ink,1.5);
 if(P)s+=Ar(390,110,435,110,C.red,2.5,`P = ${fm(P)} lb`,{end:1,dy:-8});s+=Tx(210,165,`${n} rivets Ø${d} in; plate t = ${t} in; σ_b = P/(n·d·t)`,{fs:12,it:1});return Sv(450,180,s,"Riveted lap joint")};
D.netSection=({w=2,t=0.5,d=0.75,P}={})=>{let s=Rc(40,60,300,80,C.fill)+Ci(190,100,d*30,C.bg,C.ink,2)+Ln(190,60,190,100-d*30,C.red,3)+Ln(190,100+d*30,190,140,C.red,3);s+=Ar(340,100,390,100,C.red,2.5,P?`P = ${fm(P)} lb`:"P",{end:1,dy:-8})+Ar(40,100,0+5,100,C.red,2.5);
 s+=dim(20,60,20,140,`w = ${w} in`)+Tx(190,170,`net area = (w − d)·t; hole Ø${d}, t = ${t} in`,{fs:12,it:1});return Sv(420,185,s,"Plate with hole: net section")};
window.DG=D;window.DG_fm=fm;
})();
