
import React,{useMemo,useState} from "react";
import {Plus} from "lucide-react";
import {loadStore,saveStore} from "../services/adminData";
import {PageHeader,Button,SearchBar,Badge,Table,RowActions,Modal,Input,Select,Textarea,EmptyState} from "../components/AdminUI";

const configs={
 organizations:{title:"Organismes certificateurs",desc:"Organismes qui délivrent les certifications.",key:"organizations",name:"organisme",fields:[["name","Nom"],["acronym","Sigle"],["type","Type"],["city","Ville"],["email","Email"],["website","Site web"]],types:["Public","Privé","ONG"]},
 establishments:{title:"Établissements",desc:"Établissements qui préparent les certifications.",key:"establishments",name:"établissement",fields:[["name","Nom"],["type","Statut public / privé"],["region","Région"],["city","Ville"],["address","Adresse"],["phone","Téléphone"],["email","Email"],["website","Site web"]],types:["Public","Privé"]},
 jobs:{title:"Métiers",desc:"Référentiel des métiers associés aux compétences et certifications.",key:"jobs",name:"métier",fields:[["name","Intitulé"],["description","Description"],["level","Niveau habituel"]]},
 skills:{title:"Compétences",desc:"Référentiel des compétences associées aux métiers et certifications.",key:"skills",name:"compétence",fields:[["name","Nom"],["category","Catégorie"],["description","Description"]]}
};
export default function ReferencePages({type,session}) {
 const cfg=configs[type], [store,setStore]=useState(loadStore()), [q,setQ]=useState(""), [modal,setModal]=useState(false), [form,setForm]=useState({});
 const data=store[cfg.key]||[], list=useMemo(()=>data.filter(x=>Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase())),[data,q]);
 const refresh=()=>setStore(loadStore());
 const open=(item)=>{setForm(item?{...item}:({id:undefined,name:"",type:cfg.types?.[0]||"",description:"",category:"Technique"}));setModal(true)};
 const save=()=>{const item={...form,id:form.id||`${type.slice(0,-1)}_${Date.now()}`,status:form.status||"Actif"}; const next={...store,[cfg.key]:form.id?data.map(x=>x.id===form.id?item:x):[item,...data],audit:[{id:"a_"+Date.now(),user:session.name,action:form.id?"Modification":"Création",entity:item.name,oldValue:"—",newValue:"Enregistré",date:new Date().toLocaleString("fr-FR")},...store.audit]};saveStore(next);setModal(false);refresh()};
 const remove=(id)=>{if(!confirm("Supprimer cet élément ?"))return;saveStore({...store,[cfg.key]:data.filter(x=>x.id!==id),audit:[{id:"a_"+Date.now(),user:session.name,action:"Suppression",entity:id,oldValue:"Présent",newValue:"Supprimé",date:new Date().toLocaleString("fr-FR")},...store.audit]});refresh()};
 return <div><PageHeader title={cfg.title} description={cfg.desc} action={<Button icon={Plus} onClick={()=>open()}>Ajouter un {cfg.name}</Button>}/><div className="mb-5"><SearchBar value={q} onChange={setQ} placeholder={`Rechercher un ${cfg.name}...`}/></div>
 {list.length===0?<EmptyState/>:<Table headers={[cfg.fields[0][1],"Informations","Statut","Actions"]}>{list.map(x=><tr key={x.id}><td className="px-5 py-4"><p className="font-bold">{x.name}</p><p className="text-xs text-gray-500">{x.id}</p></td><td className="px-5 py-4 text-gray-600">{cfg.fields.slice(1,4).map(([k,l])=><div key={k} className="text-xs">{l}: {x[k]||"—"}</div>)}</td><td className="px-5 py-4"><Badge tone={x.status==="Actif"?"green":"yellow"}>{x.status||"Actif"}</Badge></td><td className="px-5 py-4"><RowActions onEdit={()=>open(x)} onDelete={()=>remove(x.id)}/></td></tr>)}</Table>}
 <Modal open={modal} onClose={()=>setModal(false)} title={form.id?`Modifier ${cfg.name}`:`Nouveau ${cfg.name}`}><div className="grid gap-4 md:grid-cols-2">{cfg.fields.map(([k,label],i)=>k==="description"?<Textarea key={k} label={label} className="md:col-span-2" rows={4} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}/>:k==="type"&&cfg.types?<Select key={k} label={label} value={form[k]||cfg.types[0]} onChange={e=>setForm({...form,[k]:e.target.value})} options={cfg.types}/>:<Input key={k} label={label} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}/>)}</div><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={()=>setModal(false)}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div></Modal>
 </div>
}
