// Original SVG figures for point-and-click items
window.FIG=(function(){
function fig(q,r,show){const cls=i=>"hot"+(r.v===i?" sel":"")+(show?(i===q.answer?" right":(r.v===i?" wrong":"")):"");
 if(q.figure==="tr")return `<svg width="460" height="230"><line x1="40" y1="200" x2="440" y2="200" stroke="#000"/><line x1="40" y1="200" x2="40" y2="10" stroke="#000"/>
 <path d="M40 160 C120 150 150 40 170 30 C190 40 210 150 250 165 C300 185 380 192 440 195" fill="none" stroke="#003b6f" stroke-width="2"/><line x1="40" y1="160" x2="440" y2="160" stroke="#999" stroke-dasharray="3"/><text x="444" y="164" font-size="11">TR=1</text>
 <text x="230" y="222" font-size="12">r = ω/ωn</text><text x="235" y="215" font-size="10">√2</text>
 <rect class="${cls(0)}" data-i="0" x="42" y="15" width="100" height="183"/><rect class="${cls(1)}" data-i="1" x="142" y="15" width="90" height="183"/><rect class="${cls(2)}" data-i="2" x="250" y="15" width="188" height="183"/>
 <text x="80" y="30">A</text><text x="180" y="30">B</text><text x="330" y="30">C</text></svg>`;
 if(q.figure==="ss")return `<svg width="460" height="230"><line x1="40" y1="200" x2="440" y2="200" stroke="#000"/><line x1="40" y1="200" x2="40" y2="10" stroke="#000"/>
 <path d="M40 200 L110 70 C130 60 140 62 160 60 C240 30 300 28 340 40 C370 55 390 80 405 110" fill="none" stroke="#003b6f" stroke-width="2"/><text x="220" y="222" font-size="12">strain</text>
 ${[[105,78,0],[140,62,1],[305,30,2],[405,110,3]].map(([x,y,i])=>`<circle class="${cls(i)}" data-i="${i}" cx="${x}" cy="${y}" r="13"/><text x="${x+12}" y="${y-12}">${"ABCD"[i]}</text>`).join("")}</svg>`;
 if(q.figure==="cant")return `<svg width="460" height="200"><rect x="30" y="40" width="20" height="120" fill="#888"/><rect x="50" y="90" width="360" height="20" fill="#c9d6e3" stroke="#003b6f"/>
 <line x1="405" y1="20" x2="405" y2="88" stroke="#c00" stroke-width="3"/><polygon points="398,78 412,78 405,90" fill="#c00"/><text x="414" y="30">P</text>
 ${[[60,0],[230,1],[400,2]].map(([x,i])=>`<rect class="${cls(i)}" data-i="${i}" x="${x-18}" y="80" width="36" height="40"/><text x="${x-4}" y="140">${"ABC"[i]}</text>`).join("")}</svg>`;const ax=`<line x1="40" y1="200" x2="440" y2="200" stroke="#000"/><line x1="40" y1="200" x2="40" y2="10" stroke="#000"/>`;
 const hotR=(pts)=>pts.map(([x,y,w,h,i])=>`<rect class="${cls(i)}" data-i="${i}" x="${x}" y="${y}" width="${w}" height="${h}"/><text x="${x+4}" y="${y+16}">${"ABCD"[i]}</text>`).join("");
 const hotC=(pts)=>pts.map(([x,y,i])=>`<circle class="${cls(i)}" data-i="${i}" cx="${x}" cy="${y}" r="14"/><text x="${x+14}" y="${y-12}">${"ABCD"[i]}</text>`).join("");
 if(q.figure==="truss")return `<svg width="460" height="230"><g stroke="#003b6f" stroke-width="3"><line x1="60" y1="180" x2="400" y2="180"/><line x1="60" y1="180" x2="230" y2="60"/><line x1="230" y1="60" x2="400" y2="180"/><line x1="230" y1="60" x2="230" y2="180"/></g>
 <polygon points="60,180 48,200 72,200" fill="#888"/><circle cx="400" cy="192" r="10" fill="#888"/><line x1="230" y1="10" x2="230" y2="55" stroke="#c00" stroke-width="3"/><text x="238" y="25">P (at apex)</text><text x="236" y="198">D</text>
 ${hotR([[120,95,50,40,0],[212,105,36,60,1],[290,165,60,30,2]])}</svg>`;
 if(q.figure==="decay"){let d="M40 110";for(let x=0;x<=400;x+=4)d+=` L${40+x} ${110-80*Math.exp(-x/160)*Math.cos(x/32)}`;return `<svg width="460" height="230">${ax.replace('y1="200" x2="440" y2="200"','y1="110" x2="440" y2="110"')}<path d="${d}" fill="none" stroke="#003b6f" stroke-width="2"/><text x="380" y="225" font-size="12">time</text>
 ${hotC([[241,87,0],[330,110,1],[48,55,2]])}</svg>`}
 if(q.figure==="tr2")return `<svg width="460" height="230">${ax}<path d="M40 170 C150 165 190 30 215 25 C240 30 270 170 440 195" fill="none" stroke="#003b6f" stroke-width="2"/><text x="220" y="222" font-size="12">ω/ωn</text><text x="4" y="20" font-size="11">X/(F/k)</text>
 ${hotC([[80,168,0],[215,28,1],[400,192,2]])}</svg>`;
 if(q.figure==="fec")return `<svg width="460" height="230">${ax}<polyline points="40,140 160,140 440,140" stroke="#000" fill="none"/><path d="M40 70 L160 140 L440 30" stroke="#000" fill="none"/><path d="M40 20 L440 20" stroke="#000" stroke-dasharray="4" fill="none"/><text x="444" y="144" font-size="10">727°C</text><text x="150" y="215" font-size="11">0.76% C</text><text x="300" y="215" font-size="11">wt% C →</text>
 ${hotR([[200,150,150,40,0],[150,70,110,55,1],[300,0,120,18,2]])}</svg>`;
 if(q.figure==="ssb")return `<svg width="460" height="200"><rect x="40" y="90" width="380" height="16" fill="#c9d6e3" stroke="#003b6f"/><polygon points="40,106 28,126 52,126" fill="#888"/><circle cx="420" cy="116" r="10" fill="#888"/>
 <g stroke="#c00" stroke-width="3"><line x1="160" y1="30" x2="160" y2="86"/><line x1="300" y1="30" x2="300" y2="86"/></g><text x="150" y="25">P</text><text x="290" y="25">P</text>
 ${hotR([[50,130,100,40,0],[170,130,120,40,1],[310,130,100,40,2]])}</svg>`;
 if(q.figure==="mohr")return `<svg width="460" height="240"><line x1="20" y1="120" x2="440" y2="120" stroke="#000"/><line x1="60" y1="10" x2="60" y2="230" stroke="#000"/><text x="430" y="112">σ</text><text x="66" y="20">τ</text>
 <circle cx="240" cy="120" r="95" fill="none" stroke="#003b6f" stroke-width="2"/>${hotC([[335,120,0],[240,25,1],[145,120,2]])}</svg>`;
 if(q.figure==="views")return `<svg width="460" height="210"><rect x="30" y="40" width="110" height="110" fill="none" stroke="#000" stroke-width="2"/><circle cx="85" cy="95" r="25" fill="none" stroke="#000"/>
 <defs><pattern id="hp" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8 L8 0" stroke="#000"/></pattern></defs><rect x="175" y="40" width="40" height="110" fill="url(#hp)" stroke="#000" stroke-width="2"/><rect x="215" y="70" width="30" height="50" fill="#fff" stroke="#000"/><rect x="245" y="40" width="40" height="110" fill="url(#hp)" stroke="#000" stroke-width="2"/>
 <polygon points="320,60 420,40 430,130 330,150" fill="none" stroke="#000" stroke-width="2"/>
 ${hotR([[25,160,120,30,0],[170,160,120,30,1],[315,160,120,30,2]])}</svg>`;
 if(q.figure==="weld")return `<svg width="460" height="200"><line x1="60" y1="100" x2="360" y2="100" stroke="#000" stroke-width="2"/><line x1="60" y1="100" x2="20" y2="170" stroke="#000" stroke-width="2"/><polygon points="20,170 22,152 34,160" fill="#000"/>
 <line x1="360" y1="100" x2="390" y2="75" stroke="#000" stroke-width="2"/><line x1="360" y1="100" x2="390" y2="125" stroke="#000" stroke-width="2"/>
 <polygon points="180,100 180,70 210,100" fill="none" stroke="#000" stroke-width="2"/><polygon points="230,100 230,130 260,100" fill="none" stroke="#000" stroke-width="2"/>
 ${hotR([[220,104,50,40,0],[170,55,50,42,1],[355,65,50,70,2]])}</svg>`;
 if(q.figure==="joint")return `<svg width="460" height="230">${ax}<text x="380" y="222" font-size="12">deflection</text><text x="4" y="20" font-size="11">force</text>
 <line x1="40" y1="200" x2="300" y2="40" stroke="#003b6f" stroke-width="2"/><text x="250" y="60" font-size="11">bolt</text><line x1="160" y1="126" x2="400" y2="200" stroke="#c00" stroke-width="2"/><line x1="120" y1="200" x2="160" y2="126" stroke="#c00" stroke-width="2" stroke-dasharray="3"/><text x="330" y="170" font-size="11">members</text>
 <line x1="40" y1="40" x2="440" y2="40" stroke="#999" stroke-dasharray="3"/><text x="380" y="36" font-size="10">proof load</text>
 ${hotC([[160,126,0],[400,200,1],[300,40,2]])}</svg>`;
 if(q.figure==="gear")return `<svg width="460" height="240"><circle cx="150" cy="120" r="80" fill="none" stroke="#003b6f" stroke-width="2"/><circle cx="150" cy="120" r="75" fill="none" stroke="#999" stroke-dasharray="3"/><circle cx="150" cy="120" r="88" fill="none" stroke="#bbb"/>
 <circle cx="330" cy="120" r="100" fill="none" stroke="#003b6f" stroke-width="2"/><circle cx="330" cy="120" r="94" fill="none" stroke="#999" stroke-dasharray="3"/><line x1="150" y1="120" x2="330" y2="120" stroke="#000"/>
 <line x1="230" y1="20" x2="230" y2="220" stroke="#666" stroke-dasharray="5"/><line x1="195" y1="25" x2="265" y2="215" stroke="#c00" stroke-width="2"/>
 ${hotC([[200,52,0],[230,120,1],[230,210,2]])}<text x="300" y="232" font-size="11">dashed = base circles</text></svg>`;
 return ""}
return fig})();
