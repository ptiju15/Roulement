/* Modèle des journées et des relations RHR — bibliothèque du roulement */
(function () {
  const STORAGE_KEY = 'roulement.journees.v2';
  const DEFAULTS = [
    {code:'K110',start:'',end:''},
    {code:'K111',start:'',end:''},
    {code:'K112',start:'',end:''},
    {code:'K113',start:'',end:''},
    {code:'K114',start:'',end:''},
    {code:'K115',start:'',end:''},
    {code:'K116',start:'',end:''},
    {code:'K117',start:'',end:''}
  ];

  function clone(x){return JSON.parse(JSON.stringify(x));}
  function dayNumber(code){
    const last=String(code||'').slice(-1);
    return /^[0-7]$/.test(last) ? Number(last) : null;
  }
  function createDay(data){
    const number=dayNumber(data.code);
    const explicit=Array.isArray(data.allowedDays);
    return {
      code:String(data.code||'').trim().toUpperCase(),
      start:data.start||'',
      end:data.end||'',
      allowedDays:explicit ? data.allowedDays.slice() : (number===null||number===0?[0,1,2,3,4,5,6]:[number-1])
    };
  }
  function createRhr(data){
    return {
      id:String(data.id||('RHR-'+Date.now()+'-'+Math.random().toString(36).slice(2,7))),
      aller:String(data.aller||'').trim().toUpperCase(),
      retour:String(data.retour||'').trim().toUpperCase(),
      place:String(data.place||'').trim().toUpperCase()
    };
  }
  function load(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(raw){
        const data=JSON.parse(raw);
        if(data&&Array.isArray(data.days))return data;
      }
    }catch(e){}
    return {days:clone(DEFAULTS).map(createDay),rhrs:[]};
  }
  let state=load();
  state.days=state.days.map(createDay);
  state.rhrs=(state.rhrs||[]).map(createRhr);
  function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
  function list(){return state.days.map(clone);}
  function listRhr(){return state.rhrs.map(clone);}
  function get(code){return state.days.find(x=>x.code===code)||null;}
  function getRhr(id){return state.rhrs.find(x=>x.id===id)||null;}
  function add(data){
    const day=createDay(data);
    if(!day.code)throw new Error('Code journée obligatoire');
    if(get(day.code))throw new Error('Cette journée existe déjà');
    state.days.push(day);persist();return clone(day);
  }
  function update(code,data){
    const index=state.days.findIndex(x=>x.code===code);
    if(index<0)throw new Error('Journée introuvable');
    const next=createDay(Object.assign({},state.days[index],data));
    if(!next.code)throw new Error('Code journée obligatoire');
    if(state.days.some((x,i)=>i!==index&&x.code===next.code))throw new Error('Ce code existe déjà');
    state.days[index]=next;persist();return clone(next);
  }
  function remove(code){
    if(state.rhrs.some(x=>x.aller===code||x.retour===code))throw new Error('Cette journée est utilisée dans un RHR');
    const index=state.days.findIndex(x=>x.code===code);
    if(index<0)return false;
    state.days.splice(index,1);persist();return true;
  }
  function addRhr(data){
    const rhr=createRhr(data);
    if(!get(rhr.aller)||!get(rhr.retour))throw new Error('Les deux journées du RHR doivent exister dans la bibliothèque');
    if(!rhr.place)throw new Error('Le lieu du RHR est obligatoire');
    if(rhr.aller===rhr.retour)throw new Error('L’aller et le retour doivent être deux journées différentes');
    if(state.rhrs.some(x=>x.aller===rhr.aller&&x.retour===rhr.retour&&x.place===rhr.place))throw new Error('Ce RHR existe déjà');
    state.rhrs.push(rhr);persist();return clone(rhr);
  }
  function removeRhr(id){
    const index=state.rhrs.findIndex(x=>x.id===id);
    if(index<0)return false;
    state.rhrs.splice(index,1);persist();return true;
  }
  function reset(){state={days:clone(DEFAULTS).map(createDay),rhrs:[]};persist();return {days:list(),rhrs:listRhr()};}

  window.RoulementModel={
    TYPES:{JOURNEE:'JOURNEE',REPOS:'RP',FAC:'FAC',RM:'RM',DISPO:'DISPO'},
    createDay,createRhr,dayNumber,list,listRhr,get,getRhr,add,update,remove,addRhr,removeRhr,reset,
    validateDay(day){return !!day&&!!day.code;}
  };
})();
