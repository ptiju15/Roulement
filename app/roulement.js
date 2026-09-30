const D=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
const DAY_TYPES=['JOURNEE','RP','FAC','RM','DISPO'];
const JOURNEES=[
  {code:'K110',residence:'K',start:'',end:'',allowedDays:[0,1,2,3,4,5,6]},
  {code:'K111',residence:'K',start:'',end:'',allowedDays:[0]},
  {code:'K112',residence:'K',start:'',end:'',allowedDays:[1]},
  {code:'K113',residence:'K',start:'',end:'',allowedDays:[2]},
  {code:'K114',residence:'K',start:'',end:'',allowedDays:[3]},
  {code:'K115',residence:'K',start:'',end:'',allowedDays:[4]},
  {code:'K116',residence:'K',start:'',end:'',allowedDays:[5]},
  {code:'K117',residence:'K',start:'',end:'',allowedDays:[6]}
];
let A=Array.from({length:28},()=>Array(7).fill(null));

function optionValue(v){
  if(!v)return '';
  if(v.type==='JOURNEE')return 'J:'+v.code;
  return v.type;
}
function parseValue(v){
  if(v.startsWith('J:')) return {type:'JOURNEE',code:v.slice(2)};
  return {type:v||''};
}
function dayByCode(code){return JOURNEES.find(x=>x.code===code)||null;}

function dayNumberFromCode(code){
  const last=code.slice(-1);
  if(!/^[0-7]$/.test(last)) return null;
  return Number(last);
}

function hasVariantForDay(day, col){
  const number=col+1;
  return JOURNEES.some(j=>j.code!==day.code && j.residence===day.residence && dayNumberFromCode(j.code)===number);
}

function isDayAvailable(day, rowIndex, colIndex){
  if(!day.allowedDays.includes(colIndex)) return false;

  // A type-0 day is unavailable on a day for which a same-residence variant exists.
  if(dayNumberFromCode(day.code)===0 && hasVariantForDay(day,colIndex)) return false;

  // A specific day can only be used once in a given day/column of the weekly grid.
  for(let row=0;row<A.length;row++){
    if(row===rowIndex) continue;
    const cell=A[row][colIndex];
    if(cell && cell.type==='JOURNEE' && cell.code===day.code) return false;
  }
  return true;
}

function selectOptions(v,rowIndex,colIndex){
  let s='<option value="">—</option>';
  s+='<optgroup label="Journées">';
  JOURNEES.forEach(j=>{
    let x='J:'+j.code;
    const selected=optionValue(v)===x;
    const available=isDayAvailable(j,rowIndex,colIndex);
    const disabled=!available && !selected;
    s+='<option value="'+x+'" '+(selected?'selected ':'')+(disabled?'disabled ':'')+'>'+j.code+'</option>';
  });
  s+='</optgroup><optgroup label="Repos et autres">';
  [['RP','Repos'],['FAC','FAC'],['RM','RM'],['DISPO','DISPO']].forEach(([x,l])=>s+='<option value="'+x+'" '+(v&&v.type===x?'selected':'')+'>'+l+'</option>');
  s+='</optgroup>';return s;
}
function draw(){
  n.value=A.length;
  let s='<tr><th class=week>Ligne</th>'+D.map((x,i)=>'<th class='+(i>4?'weekend':'')+'>'+x+'</th>').join('')+'</tr>';
  A.forEach((row,i)=>{
    s+='<tr><td class=week>'+(i+1)+'</td>';
    row.forEach((v,j)=>{
      let cls=(j>4?'weekend ':'')+(v&&v.type==='RP'?'rp ':'')+(v&&v.type==='FAC'?'fac ':'')+(v&&v.type==='RM'?'rm ':'')+(v&&v.type==='DISPO'?'dispo ':'');
      s+='<td id=c'+i+'_'+j+' class="'+cls+'"><select onchange="setCell('+i+','+j+',this.value)">'+selectOptions(v,i,j)+'</select></td>';
    });s+='</tr>';
  });
  t.innerHTML=s;calc();
}
function setCell(i,j,value){
  A[i][j]=parseValue(value);
  draw();
}
function resize(){let x=Math.max(1,+n.value||1);while(A.length<x)A.push(Array(7).fill(null));while(A.length>x)A.pop();draw()}
function add(){A.push(Array(7).fill(null));draw()}
function del(){if(A.length>1)A.pop();draw()}
function empty(){A=A.map(()=>Array(7).fill(null));draw()}
function demo(){empty();[[3,4],[3,5],[3,6],[4,5],[4,6],[5,6],[6,0],[9,6],[10,0],[10,5],[10,6],[17,5],[17,6],[24,5],[24,6],[25,0]].forEach(x=>{if(A[x[0]])A[x[0]][x[1]]={type:'RP'}});draw()}
function analyse(){
  let N=Math.max(1,+w.value||52),days=Array.from({length:N*7},(_,i)=>A[Math.floor(i/7)%A.length][i%7]);
  let total=days.filter(x=>x&&x.type==='RP').length,periods=[],i=0;
  while(i<days.length){if(!days[i]||days[i].type!=='RP'){i++;continue}let st=i;while(i<days.length&&days[i]&&days[i].type==='RP')i++;periods.push({st,len:i-st})}
  let doubles=periods.filter(p=>p.len===2),satDim=doubles.filter(p=>p.st%7===5).length,sunMon=doubles.filter(p=>p.st%7===6).length;
  return {total,periods,doubleTriple:periods.filter(p=>p.len===2||p.len===3).length,tooLong:periods.filter(p=>p.len>3).length,satDim,sunMon,weekendDoubles:satDim+sunMon};
}
function box(label,value,target){let ok=value>=target;return '<div class="card '+(ok?'ok':'warn')+'"><div>'+label+'</div><b>'+value+'</b> / '+target+(ok?' ✓':'')+'</div>'}
function calc(){let x=analyse();let h=box('Jours de repos annuels',x.total,116)+box('Périodes RP doubles ou triples',x.doubleTriple,52)+box('RP doubles Sam-Dim ou Dim-Lun',x.weekendDoubles,14)+box('RP doubles Sam-Dim',x.satDim,12);if(x.tooLong)h+='<div class="card bad"><div>Périodes RP > 3 jours</div><b>'+x.tooLong+'</b><div>À vérifier.</div></div>';h+='<div class=card><div>Répartition</div><b>Sam-Dim : '+x.satDim+'</b><br>Dim-Lun : '+x.sunMon+'</div>';r.innerHTML=h}
function csv(){let s='Ligne;'+D.join(';')+'\n';A.forEach((row,i)=>s+=(i+1)+';'+row.map(v=>v?(v.type==='JOURNEE'?v.code:v.type):'').join(';')+'\n');let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([s],{type:'text/csv'}));a.download='roulement.csv';a.click()}
draw();
