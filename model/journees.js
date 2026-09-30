/* Modèle des journées et des relations RHR — bibliothèque du roulement */
(function () {
  const STORAGE_KEY = 'roulement.journees.v3';
  const DEFAULTS = [
    {code:'K526',start:'10:00',end:'19:49'},
    {code:'K117',start:'16:48',end:'00:37'},
    {code:'K111',start:'16:48',end:'00:37'},
    {code:'K150',start:'',end:''},{code:'K160',start:'',end:''},
    {code:'K416',start:'12:46',end:'21:38'},{code:'K427',start:'12:06',end:'23:02'},
    {code:'K221',start:'',end:''},{code:'K230',start:'',end:''},
    {code:'K330',start:'05:17',end:'09:57'},{code:'K926',start:'09:10',end:'17:58'},
    {code:'K347',start:'',end:''},{code:'K351',start:'',end:''},
    {code:'K211',start:'12:29',end:'21:17'},
    {code:'K210*',start:'',end:'',allowedDays:[1,2]},
    {code:'K110',start:'16:48',end:'00:37'},{code:'K115',start:'16:48',end:'00:37'},
    {code:'K920',start:'08:59',end:'17:14'},{code:'K174',start:'',end:''},{code:'K185',start:'',end:''},
    {code:'K916',start:'',end:''},{code:'K927',start:'',end:''},
    {code:'K310',start:'',end:''},{code:'K324',start:'',end:''},
    {code:'K260*',start:'',end:'',allowedDays:[1,2,3]},
    {code:'K120',start:'',end:''},{code:'K130*',start:'',end:''},
    {code:'K415',start:'',end:''},{code:'K426',start:'',end:''},
    {code:'K220',start:'',end:''},{code:'K345',start:'04:23',end:'12:01'},{code:'K266',start:'06:12',end:'13:54'},
    {code:'K131',start:'13:17',end:'23:22'},{code:'K921',start:'08:59',end:'17:14'},
    {code:'K315',start:'',end:''},{code:'K226',start:'',end:''},{code:'K237',start:'',end:''},
    {code:'K151',start:'',end:''},{code:'K145',start:'14:16',end:'21:14'},{code:'K616',start:'14:39',end:'19:42'},
    {code:'K517',start:'',end:''},{code:'K521',start:'',end:''},{code:'K615',start:'16:44',end:'00:14'},
    {code:'K246',start:'17:47',end:'22:46'},{code:'K317',start:'',end:''},{code:'K321',start:'',end:''},
    {code:'K125',start:'',end:''},{code:'K135',start:'',end:''},
    {code:'K341',start:'04:23',end:'09:25'},{code:'K425',start:'13:14',end:'20:54'},
    {code:'K340',start:'04:23',end:'09:25'},{code:'K335',start:'05:17',end:'09:57'},
    {code:'K261',start:'06:15',end:'13:40'},{code:'K165',start:'',end:''},{code:'K116',start:'16:51',end:'00:37'},
    {code:'K227',start:'',end:''},{code:'K231',start:'',end:''},{code:'K355',start:'',end:''},{code:'K366',start:'',end:''},
    {code:'K437',start:'',end:''},{code:'K441',start:'',end:''},{code:'K225',start:'',end:''},{code:'K236',start:'',end:''},
    {code:'K617',start:'13:43',end:'19:42'},{code:'K311',start:'',end:''},{code:'K320',start:'',end:''},
    {code:'K344',start:'04:23',end:'09:25'},{code:'K265',start:'06:45',end:'13:40'},{code:'K446',start:'04:54',end:'15:46'},
    {code:'K336',start:'05:51',end:'13:01'}
  ];
  const DEFAULT_RHRS = [
    ['K150','K160','BRD'],['K221','K230','TE'],['K347','K351','FIG'],['K174','K185','MSA'],
    ['K916','K927','BLG'],['K310','K324','CDC'],['K120','K130*','CLE'],['K415','K426','BLG'],
    ['K220','K230','TE'],['K226','K237','TE'],['K151','K160','BRD'],['K517','K521','MSA'],
    ['K317','K321','CDC'],['K125','K135','CLE'],['K310','K325','CDC'],['K431','K442','MSA'],
    ['K150','K165','BRD'],['K227','K231','TE'],['K355','K366','CDC'],['K437','K441','MSA'],
    ['K225','K236','TE'],['K311','K320','CDC'],['K310','K320','CDC'],['K220','K235','TE']
  ];
  function clone(x){return JSON.parse(JSON.stringify(x));}
  function dayNumber(code){
    const last=String(code||'').slice(-1);
    return /^[0-7]$/.test(last) ? Number(last) : null;
  }
  function createDay(data){
    const number=dayNumber(data.code);
    const explicit=Array.isArray(data.allowedDays);
    return {code:String(data.code||'').trim().toUpperCase(),start:data.start||'',end:data.end||'',allowedDays:explicit?data.allowedDays.slice():(number===null||number===0?[0,1,2,3,4,5,6]:[number-1])};
  }
  function createRhr(data){
    return {id:String(data.id||('RHR-'+Date.now()+'-'+Math.random().toString(36).slice(2,7))),aller:String(data.aller||'').trim().toUpperCase(),retour:String(data.retour||'').trim().toUpperCase(),place:String(data.place||'').trim().toUpperCase()};
  }
  function defaultState(){return {days:clone(DEFAULTS).map(createDay),rhrs:DEFAULT_RHRS.map(x=>createRhr({aller:x[0],retour:x[1],place:x[2]}))};}
  function load(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const data=JSON.parse(raw);if(data&&Array.isArray(data.days))return data;}}catch(e){}return defaultState();}
  let state=load();state.days=state.days.map(createDay);state.rhrs=(state.rhrs||[]).map(createRhr);
  function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
  function list(){return state.days.map(clone);} function listRhr(){return state.rhrs.map(clone);}
  function get(code){return state.days.find(x=>x.code===code)||null;} function getRhr(id){return state.rhrs.find(x=>x.id===id)||null;}
  function add(data){const day=createDay(data);if(!day.code)throw new Error('Code journée obligatoire');if(get(day.code))throw new Error('Cette journée existe déjà');state.days.push(day);persist();return clone(day);}
  function update(code,data){const index=state.days.findIndex(x=>x.code===code);if(index<0)throw new Error('Journée introuvable');const next=createDay(Object.assign({},state.days[index],data));if(!next.code)throw new Error('Code journée obligatoire');if(state.days.some((x,i)=>i!==index&&x.code===next.code))throw new Error('Ce code existe déjà');state.days[index]=next;persist();return clone(next);}
  function remove(code){if(state.rhrs.some(x=>x.aller===code||x.retour===code))throw new Error('Cette journée est utilisée dans un RHR');const index=state.days.findIndex(x=>x.code===code);if(index<0)return false;state.days.splice(index,1);persist();return true;}
  function addRhr(data){const rhr=createRhr(data);if(!get(rhr.aller)||!get(rhr.retour))throw new Error('Les deux journées du RHR doivent exister dans la bibliothèque');if(!rhr.place)throw new Error('Le lieu du RHR est obligatoire');if(rhr.aller===rhr.retour)throw new Error('L’aller et le retour doivent être deux journées différentes');if(state.rhrs.some(x=>x.aller===rhr.aller&&x.retour===rhr.retour&&x.place===rhr.place))throw new Error('Ce RHR existe déjà');state.rhrs.push(rhr);persist();return clone(rhr);}
  function removeRhr(id){const index=state.rhrs.findIndex(x=>x.id===id);if(index<0)return false;state.rhrs.splice(index,1);persist();return true;}
  function reset(){state=defaultState();persist();return {days:list(),rhrs:listRhr()};}
  window.RoulementModel={TYPES:{JOURNEE:'JOURNEE',REPOS:'RP',FAC:'FAC',RM:'RM',DISPO:'DISPO'},createDay,createRhr,dayNumber,list,listRhr,get,getRhr,add,update,remove,addRhr,removeRhr,reset,validateDay(day){return !!day&&!!day.code;}};
})();