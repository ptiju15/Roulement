/* Modèle des journées — bibliothèque des journées */
(function () {
  const STORAGE_KEY = 'roulement.journees.v1';
  const DEFAULTS = [
    {code:'K110',residence:'K',start:'',end:'',allowedDays:[0,1,2,3,4,5,6]},
    {code:'K111',residence:'K',start:'',end:'',allowedDays:[0]},
    {code:'K112',residence:'K',start:'',end:'',allowedDays:[1]},
    {code:'K113',residence:'K',start:'',end:'',allowedDays:[2]},
    {code:'K114',residence:'K',start:'',end:'',allowedDays:[3]},
    {code:'K115',residence:'K',start:'',end:'',allowedDays:[4]},
    {code:'K116',residence:'K',start:'',end:'',allowedDays:[5]},
    {code:'K117',residence:'K',start:'',end:'',allowedDays:[6]}
  ];

  function clone(x){return JSON.parse(JSON.stringify(x));}
  function dayNumber(code){
    const last=String(code||'').slice(-1);
    return /^[0-7]$/.test(last) ? Number(last) : null;
  }
  function createDay(data){
    const number=dayNumber(data.code);
    return {
      code:String(data.code||'').trim().toUpperCase(),
      residence:String(data.residence||'').trim().toUpperCase(),
      start:data.start||'',
      end:data.end||'',
      allowedDays:Array.isArray(data.allowedDays) ? data.allowedDays.slice() : (number===null||number===0?[0,1,2,3,4,5,6]:[number-1]),
      rhrId:data.rhrId||null,
      rhrRole:data.rhrRole||null,
      rhrPlace:data.rhrPlace||''
    };
  }
  function load(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(raw){const data=JSON.parse(raw);if(Array.isArray(data)&&data.length)return data.map(createDay);}
    }catch(e){}
    return clone(DEFAULTS).map(createDay);
  }
  let days=load();
  function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(days));}
  function list(){return days.map(clone);}
  function get(code){return days.find(x=>x.code===code)||null;}
  function add(data){
    const day=createDay(data);
    if(!day.code)throw new Error('Code journée obligatoire');
    if(get(day.code))throw new Error('Cette journée existe déjà');
    days.push(day);persist();return clone(day);
  }
  function update(code,data){
    const index=days.findIndex(x=>x.code===code);
    if(index<0)throw new Error('Journée introuvable');
    const next=createDay(Object.assign({},days[index],data));
    if(!next.code)throw new Error('Code journée obligatoire');
    if(days.some((x,i)=>i!==index&&x.code===next.code))throw new Error('Ce code existe déjà');
    days[index]=next;persist();return clone(next);
  }
  function remove(code){
    const index=days.findIndex(x=>x.code===code);
    if(index<0)return false;
    days.splice(index,1);persist();return true;
  }
  function reset(){days=clone(DEFAULTS).map(createDay);persist();return list();}

  window.RoulementModel={
    TYPES:{JOURNEE:'JOURNEE',REPOS:'RP',FAC:'FAC',RM:'RM',DISPO:'DISPO'},
    createDay, dayNumber, list, get, add, update, remove, reset,
    validateDay(day){return !!day&&!!day.code;}
  };
})();
