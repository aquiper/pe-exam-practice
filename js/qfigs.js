// Maps question templates to original parametric diagrams. Values come only from the question stem.
(function(){
const D=window.DG;if(!D)return;
const num=s=>s==null?undefined:parseFloat(String(s).replace(/,/g,""));
const N="(-?[\\d,]*\\.?\\d+)";
function mk(stem){const g=(re)=>{const m=stem.match(new RegExp(re.replace(/#/g,N),"i"));return m?num(m[1]):undefined};
 const gg=(re)=>{const m=stem.match(new RegExp(re.replace(/#/g,N),"i"));return m?m.slice(1).map(num):[]};return {g,gg}}
const ok=(...a)=>a.every(x=>x!==undefined&&!isNaN(x));
const R=[
[/incline/i,/crate|block/i,(s,{g})=>{const t=g("# ?° incline");return ok(t)&&D.fbdIncline({theta:t,showFriction:/friction/i.test(s)})}],
[/rolling/i,null,(s,{g})=>{const t=g("# ?° incline");return ok(t)&&D.rolling({theta:t,body:/hoop/i.test(s)?"hoop":/sphere/i.test(s)?"sphere":"disk"})}],
[/truss/i,/apex/i,(s,{g})=>{const P=g("load of # lb"),t=g("angle of # ?°");return ok(P,t)&&D.trussApex({P,theta:t})}],
[/ladder/i,null,(s,{g})=>{const t=g("at # ?° above");return ok(t)&&D.fbdLadder({theta:t})}],
[/beam reactions/i,null,(s,{g})=>{const L=g("span #"),P=g("load of # lb"),a=g("located # ft");return ok(L,P,a)&&D.beamSS({L,P,a,quiz:1})}],
[/impact/i,null,(s,{g,gg})=>{const [m1,v1]=gg("# kg ball moving at # m/s"),m2=g("stationary # kg"),e=g("restitution is #");return ok(m1,v1,m2,e)&&D.impact({m1,v1,m2,e})}],
[/centroid/i,/T-section/i,(s,{gg})=>{const [b1,t1]=gg("flange # in wide × # in"),[b2,h2]=gg("web # in wide × # in");return ok(b1,t1,b2,h2)&&D.tSection({b1,t1,b2,h2,quiz:1})}],
[/torsion – (shear|twist)|torsion – twist angle$/i,/in-lb/,(s,{g})=>{const d=g("# in (in diameter|solid)"),T=g("# in-lb"),L=g("is # in long");return ok(d,T)&&D.torsionShaft({d,T,L:L,u:"in"})}],
[/principal stress|mohr's circle – max|von Mises|Tresca/i,/σ_?x = /,(s,{g})=>{let sx=g("σ_?x = #"),sy=g("σ_?y = #"),t=g("τ_?xy = #");if(sy===undefined)sy=0;if(!ok(sx,t))return;const k=Math.abs(sx)>=1000?1000:1;return D.mohr({sx:sx/k,sy:sy/k,txy:t/k,u:k>1?"ksi":"ksi",quiz:1})}],
[/buckling – euler|columns – euler/i,null,(s,{g})=>{const m=s.match(/(fixed–fixed|fixed–pinned|pinned–pinned|fixed–free)/i);return D.columnChart({hl:m?m[1].replace("–","-"):undefined})}],
[/thermal stress/i,null,(s,{g})=>{const dT=g("heated #"),L=g("# in long"),gap=g("gap of # in");return ok(dT)&&D.thermalBar({L:L,dT,gap:gap||0})}],
[/thin-wall vessel/i,/diameter/,(s,{g})=>{const Dd=g("# in mean diameter"),t=g("# in wall"),p=g("holds # psig");return ok(Dd,t,p)&&D.vessel({D:Dd,t,p})}],
[/thick.*cylinder/i,null,(s,{g})=>{let ri=g("inner radius # in")??g("r_i = # in"),ro=g("outer radius # in")??g("r_o = # in"),pi=g("internal pressure of # psi"),po=g("external pressure # psi");return ok(ri,ro)&&D.thickCyl({ri,ro,pi:pi||0,po:po||0})}],
[/goodman|gerber|asme elliptic/i,/σ_?a = /,(s,{g})=>{const Sut=g("S_?ut? = # ksi"),Se=g("S_?e = # ksi"),sa=g("σ_?a = # ksi"),sm=g("σ_?m = # ksi"),Sy=g("S_?y = # ksi");if(!ok(Se,sa,sm)||!ok(Sut??Sy))return;return D.goodman({Se,Sut:Sut??Sy,sa,sm,quiz:1})}],
[/S-N/i,null,(s,{g})=>{const Sut=g("S_ut = # ksi"),Se=g("S_e = # ksi"),sa=g("σ_a = # ksi");return ok(Sut,Se)&&D.snCurve({Sut,Se,sa})}],
[/helical spring rate|spring stress – Wahl|surge/i,null,(s,{g})=>{const d=g("(?:wire diameter|d =) # in"),Dm=g("(?:mean coil diameter|D =) # in"),N=g("# active coils"),F=g("carries # lb");return ok(d,Dm)&&D.spring({d,Dm,N:N,F:F})}],
[/bearing life|bearing – combined/i,null,(s,{g})=>{const C=g("C = # N"),P=g("load of # N"),n=g("at # rpm");return ok(C,n)&&D.bearing({C,P,n,type:/roller/i.test(s)?"roller":"ball"})}],
[/power screw|jack screw/i,null,(s,{g})=>{const dm=g("(?:mean diameter|d_m =) # in"),l=g("lead (?:= )?# in"),W=g("(?:raise|raises) (?:a )?# lb"),dc=g("collar of mean diameter # in");return ok(dm,l,W)&&D.powerScrew({dm,l,W,dc})}],
[/hydraulic cylinder$/i,null,(s,{g})=>{const Db=g("# in bore"),d=g("# in rod"),p=g("at # psi");return ok(Db,d,p)&&D.hydCyl({Db,d,p})}],
[/hydraulic cylinder speed/i,null,(s,{g})=>{const Db=g("# in bore"),Q=g("# gpm");return ok(Db,Q)&&D.hydCyl({Db,Q})}],
[/planetary/i,null,(s,{g})=>{const Ns=g("sun \\(#T"),Nr=g("ring \\(#T");return ok(Ns,Nr)&&D.planetary({Ns,Nr})}],
[/bolt preload|bolt torque/i,null,(s,{g})=>D.boltJoint({})],
[/bolted joint – (load|separation)/i,null,(s,{g})=>D.jointDiagram({quiz:1})],
[/member stiffness/i,null,(s,{g})=>{const d=g("by a # in bolt");return ok(d)&&D.boltJoint({d})}],
[/pins in double shear/i,null,(s,{g})=>{const d=g("# in diameter"),F=g("load of # lb"),n=g("uses # pins");return ok(d,F,n)&&D.pinShear({d,F,n})}],
[/^fillet weld$/i,null,(s,{g})=>{const h=g("# in fillet"),L=g("each # in long"),F=g("by # lb");return ok(h,L,F)&&D.weldTypes({h,L,F})}],
[/weld – torsion/i,null,(s,{g})=>{const r=g("radius # in"),h=g("# in fillet"),T=g("torque of # in-lb");return ok(r,h,T)&&D.weldCircle({r,h,T})}],
[/eccentric bolt group$/i,null,(s,{g})=>{const a=g("# in × "),P=g("load of # lb"),e=g("acts # in");if(!ok(a,P,e))return;const h=a/2;return D.eccBolts({pts:[[-h,-h],[h,-h],[-h,h],[h,h]],P,e})}],
[/eccentric bolt group – line/i,null,(s,{g})=>{const n=g("^# bolts"),sp=g("at # in spacing"),P=g("load of # lb"),e=g("acts # in");if(!ok(n,sp,P,e))return;const pts=[];for(let i=0;i<n;i++)pts.push([0,(i-(n-1)/2)*sp]);return D.eccBolts({pts,P,e})}],
[/key shear|key length/i,null,(s,{g})=>{const d=g("# in (?:diameter|shaft)"),w=g("(?:key|\\() ?\\(?# in"),L=g("# in long"),T=g("# in-lb");return ok(d,T)&&D.keyShaft({d,w,L,T})}],
[/rivets – bearing/i,null,(s,{g})=>{const n=g("uses # rivets"),d=g("# in diameter"),t=g("plates # in"),P=g("carry # lb");return ok(n,d,t,P)&&D.rivetRow({n,d,t,P})}],
[/net-section/i,null,(s,{g})=>{const w=g("# in wide"),t=g("# in thick"),d=g("single # in hole"),P=g("carries # lb");return ok(w,t,d,P)&&D.netSection({w,t,d,P})}],
[/press fit – torque/i,null,(s,{g})=>{const d=g("# in solid"),Do=g("OD # in"),L=g("length # in"),de=g("interference of # in");return ok(d,Do,L,de)&&D.pressFit({d,Do,L,delta:de})}],
[/adhesive lap/i,null,(s,{g})=>{const b=g("strips # in"),P=g("carry # lb");return ok(b,P)&&D.lapJoint({b,P})}],
[/spur gear forces|gear geometry – center/i,null,(s,{g})=>{const N1=g("(?:an? )?#-tooth (?:spur )?pinion"),Pd=g("(?:diametral pitch #|pitch #)"),N2=g("#-tooth gear"),phi=g("# ?° pressure");return ok(N1,Pd)&&D.gearMesh({N1,N2:N2||N1*2.5,P:Pd,phi:phi||20,quiz:N2?0:1})}],
[/gear geometry – module/i,null,(s,{g,gg})=>{const m=g("m = # mm"),[a,b]=gg("have # and # teeth");return ok(m,a,b)&&D.gearMesh({N1:a,N2:b,m})}],
[/helical gear forces/i,null,(s,{g})=>{const psi=g("helix angle # ?°"),Wt=g("load of # lb");return ok(psi,Wt)&&D.gearForces({Wt,phi:20,psi})}],
[/belt drive power/i,null,(s,{g,gg})=>{const Db=g("on a # in pulley"),[T1,T2]=gg("tensions of # lb and # lb");return ok(Db,T1,T2)&&D.belt({D:Db,T1,T2})}],
[/belt length/i,null,(s,{g,gg})=>{const [a,b]=gg("pulleys of # in and # in"),C=g("distance of # in");return ok(a,b,C)&&D.belt({D:a,d:b,Cd:C})}],
[/belt\/capstan|band brake/i,null,(s,{g})=>{const th=g("(?:wrapped|a) # ?° (?:around|wrap)"),Db=g("on a # in drum"),T=g("tension is # lb");return ok(th,T)&&D.bandBrake({D:Db,theta:th,T1:/brake/i.test(s)?T:undefined})}],
[/disk clutch/i,null,(s,{g})=>{const N=g("has # friction"),Do=g("outer diameter # in"),d=g("inner diameter # in"),F=g("force # lb");return ok(N,Do,d,F)&&D.clutch({D:Do,d,N,F})}],
[/shaft critical speed/i,null,(s,{g})=>{const W=g("A # lb disk"),d=g("# in diameter"),L=g("# in apart");return ok(W,d,L)&&D.shaftLayout({W,L,d})}],
[/motors? – (synchronous|line)|motor torque/i,null,(s,{g})=>{const hp=g("# hp"),n=g("at # rpm"),poles=g("#-pole");return D.motor({hp,n,poles,f:poles?60:undefined})}],
[/flywheel energy/i,null,(s,{g,gg})=>{const m=g("mass of # kg"),r=g("radius of # m"),[n1,n2]=gg("from # rpm to # rpm");return ok(m,r,n1,n2)&&D.flywheel({m,r,n1,n2})}],
[/natural frequency$|critical damping|damping ratio/i,null,(s,{g})=>{const m=g("(?:# kg mass|m = # kg)"),k=g("(?:stiffness|k =) # (?:k?N)");const c=g("c = # N");return ok(m)&&D.springMass({m,k:(k!==undefined&&/kN\/m/.test(s.split("stiffness")[1]||s.split("k =")[1]||""))?k*1000:k,c})}],
[/springs in (series|parallel)/i,null,(s,{g,gg})=>{const m=g("# kg"),[k1]=gg("k₁ = #"),[k2]=gg("k₂ = #");return ok(m,k1,k2)&&D.springMass({m,arr:/series/i.test(s)?"series":"parallel",k:[k1,k2],ku:/kN/.test(s)?"kN/m":"N/m"})}],
[/transmissibility$/i,null,(s,{g})=>{const r=g("ω\\/ωn = #"),z=g("ζ = #");return ok(r,z)&&D.transmissibility({r,z})}],
[/log decrement/i,null,(s,{g,gg})=>{const x0=g("amplitude of # mm"),n=g("# cycles later"),xn=g("peak is # mm");return ok(x0,n,xn)&&D.decay({x0,xn,n})}],
[/cantilever frequency/i,null,(s,{g,gg})=>{const m=g("A # kg"),L=g("# m long"),[b,h]=gg("# mm wide × # mm");return ok(m,L,b,h)&&D.cantMass({m,L,b,h})}],
[/compound pendulum/i,null,(s,{g})=>{const L=g("length # m");return ok(L)&&D.pendulum({L})}],
[/lever rule/i,null,(s,{g})=>{const C0=g("with # wt%");return ok(C0)&&D.ironCarbon({C0})}],
[/economics – (present worth|annual cost|sinking|EUAC with)/i,null,(s,{g})=>{const P=g("costs \\$#"),A=g("saves \\$#")??g("O&M of \\$#"),F=g("needs \\$#"),n=g("for # years")??g("#-year")??g("life of # years")??g("in # years"),Sv=g("salvage value of \\$#"),i=g("(?:rate of|i =|at) # ?%");return ok(n)&&n<=25&&D.cashflow({P,A,F,n,S:Sv,i})}],
[/break-even/i,null,(s,{g})=>{const FC=g("costs of \\$#"),p=g("sells for \\$#"),v=g("variable cost of \\$#");return ok(FC,p,v)&&D.breakeven({FC,p,v,quiz:1})}],
[/reliability – series/i,null,(s,{g})=>{const a=g("A \\(R = #"),b=g("each R = #"),c=g("C \\(R = #");return ok(a,b,c)&&D.reliability({series:[a],par:[b,b],after:[c]})}],
[/fits – clearance/i,null,(s,{gg})=>{const [hmin,hmax]=gg("hole is dimensioned #/#"),[smin,smax]=gg("shaft #/#");return ok(hmin,hmax,smin,smax)&&D.fits({hmin,hmax,smin,smax})}],
[/tolerance stack/i,null,(s)=>{const m=[...s.matchAll(/±(\d*\.\d+)/g)].map(x=>+x[1]);return m.length>1&&D.tolStack({t:m})}],
[/cpk/i,null,(s,{g,gg})=>{const [LSL,USL]=gg("limits # to #"),mu=g("mean is #"),sd=g("deviation #");return ok(LSL,USL,mu,sd)&&D.cpk({LSL,USL,mu,s:sd})}],
[/interpolation/i,null,(s,{gg,g})=>{const [y1,x1,y2,x2]=gg("lists # at # °F and # at # °F"),x=g("value at # °F");return ok(y1,x1,y2,x2,x)&&D.interp({x1,y1,x2,y2,x})}],
[/machining – (spindle|surface)|machining – cutting time/i,null,(s,{g})=>{const Dw=g("# in diameter"),V=g("# sfm"),f=g("feed of # in"),N=g("speed of # rpm");return (ok(Dw,V)||ok(f,N))&&D.machining({D:Dw,V,f,N})}],
[/strain gage|instrumentation/i,/gage/i,()=>D.strainGage()],
[/stepped bar/i,null,(s,{gg,g})=>{const [L1,d1]=gg("# in long segment of # in"),rest=s.split("segment")[1]||"",m=rest.match(/a ([\d.]+) in long segment of ([\d.]+) in/),P=g("load of # lb");return ok(L1,d1,P)&&m&&D.axialBar({segs:[[L1,d1],[+m[1],+m[2]]],P})}],
[/beam bending stress/i,null,(s,{g})=>{const L=g("spans # in"),P=g("a # lb load");return ok(L,P)&&D.beamSS({L,P,a:L/2,uL:"in",quiz:1})}],
[/beam deflection – (simply|off)/i,null,(s,{g})=>{const L=g("span #"),P=g("carries # lb"),a=g("at # in from");return ok(L,P)&&D.beamSS({L,P,a:a??L/2,uL:"in",quiz:1})}],
[/beam deflection – cantilever/i,null,(s,{g})=>{const L=g("# in long"),w=g("load of # lb\\/in");return ok(L,w)&&D.cantilever({L,w,quiz:1})}],
[/beam bending – UDL/i,null,(s,{g})=>{const L=g("spanning # ft"),w=g("load of # lb\\/ft");return ok(L,w)&&D.beamSS({L,w,quiz:1})}],
[/transverse shear( stress| – rect)/i,null,(s,{g,gg})=>{const [b,h]=gg("# in wide (?:×|by) # in"),V=g("force of # lb");return ok(b,h,V)&&D.shearDist({b,h,V,quiz:1})}],
[/tensile test|stress-strain|true stress|resilience|toughness/i,null,(s,{g})=>{const Sy=g("Sy = # ksi"),Su=g("Su = # ksi");return ok(Sy,Su)?D.stressStrain({Sy,Su}):undefined}],
[/axial deformation$/i,null,(s,{g})=>{const d=g("# mm in diameter"),L=g("# m long"),P=g("load of # kN");return ok(d,L,P)&&D.axialBar({segs:[[L,d]],P,uL:"m",uP:"kN",ud:"mm"})}],
[/shaft – combined/i,null,(s,{g})=>{const d=g("# in diameter"),T=g("torque of # in-lb");return ok(d,T)&&D.torsionShaft({d,T})}],
[/chain/i,/sprocket/,(s,{g})=>{const p=g("# in pitch"),N=g("#-tooth"),n=g("at # rpm");return ok(p,N,n)&&D.chain({N,p,n})}],
[/shear pin through shaft/i,null,(s,{g})=>{const d=g("A # in diameter pin"),F=undefined;return ok(d)&&D.pinShear({d,n:1})}],
[/engineering drawings|orthographic/i,/projection|view/i,()=>D.ortho()],
[/GD&T/i,/control|tolerance/i,()=>D.gdtTable()],
[/corrosion|galvanic/i,null,()=>D.galvanic()],
];
const nums=s=>(String(s).replace(/(\d),(\d{3})/g,"$1$2").replace(/×10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g,"").match(/-?\d*\.?\d+/g)||[]).map(Number);
const SMALL=new Set([0,1,2,3,10]);
// Keep only labels whose numbers all appear in the stem, so a figure never shows a value the question does not give (and never the answer).
function scrub(svg,stem){const sn=nums(stem);const hit=v=>{const a=Math.abs(v);return SMALL.has(a)||sn.some(x=>{x=Math.abs(x);return Math.abs(x-a)<1e-9*Math.max(1,x)||Math.abs(x-a*1000)<1e-6})};
 return svg.replace(/<text([^>]*)>([^<]*)<\/text>/g,(m,attr,t)=>{const tt=t.replace(/&amp;/g,"&");if(/^\d{1,2}$/.test(tt.trim()))return m;const v=nums(tt);return v.every(hit)?m:""})}
const RAW=/columnChart|gdtTable|ortho|galvanic|strainGage/;
function figFor(q){if(!q||!q.stem||q.type==="pc")return "";const t=q.topic||"";for(const [re,re2,f] of R){if(!re.test(t))continue;if(re2&&!re2.test(q.stem))continue;try{const svg=f(q.stem,mk(q.stem));if(svg)return RAW.test(String(f))?svg:scrub(svg,q.stem)}catch(e){}return ""}return ""}
window.QFIG={figFor,scrub,rules:R.length};
})();
