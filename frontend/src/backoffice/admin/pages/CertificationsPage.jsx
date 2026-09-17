
import React,{useMemo,useState} from "react";
import {Plus, Eye, Copy, Upload, Archive, RotateCcw} from "lucide-react";
import {loadStore,saveStore,can} from "../services/adminData";
import {PageHeader,Button,SearchBar,Select,MultiSelect,Badge,Table,RowActions,Modal,Input,Textarea,statusTone,EmptyState} from "../components/AdminUI";
import {useNavigate} from "react-router-dom";

const empty={title:"",acronym:"",code:"",type:"Certification professionnelle",domain:"Numérique et informatique",subdomain:"",level:"Certification Professionnelle",entryLevel:"",exitLevel:"",duration:"",hours:"",format:"Présentiel",nature:"Certification professionnelle",description:"",objectives:"",skills:"",organizationId:"",organizationName:"",verificationStatus:"En cours de vérification",status:"En cours de vérification",decisions:[],establishmentIds:[],jobIds:[],skillIds:[],published:false,archived:false};
const emptyDecision={status:"Vérifiée",authority:"",decisionRef:"",decisionDate:"",validFrom:"",validTo:"",sourceId:""};
const latestDecision=c=>(c.decisions&&c.decisions[0])||null;

export default function CertificationsPage({session}){
const nav=useNavigate();
const [store,setStore]=useState(loadStore() || {});
const [q,setQ]=useState("");
const [status,setStatus]=useState("Tous");
const [modal,setModal]=useState(false);
const [form,setForm]=useState(empty);
const [newDecision,setNewDecision]=useState(emptyDecision);
const [view,setView]=useState(null);

const certifications=store.certifications || [];
const domains=store.domains || [];
const levels=store.levels || [];
const organizations=store.organizations || [];
const establishments=store.establishments || [];
const jobs=store.jobs || [];
const skillsRef=store.skills || [];
const sources=store.sources || [];
const audit=store.audit || [];
const refresh=()=>setStore(loadStore());
const list=useMemo(()=>certifications.filter(c=>
  (status==="Tous"||c.status===status||(status==="Publié"&&c.published)) &&
  (c.title+" "+c.organizationName+" "+c.domain+" "+c.code).toLowerCase().includes(q.toLowerCase())
),[certifications,q,status]); const openCreate=()=>{setForm({...empty,id:undefined,organizationName:""});setNewDecision(emptyDecision);setModal(true)};
 const openEdit=c=>{setForm({...empty,...c,objectives:(c.objectives||[]).join("\n"),skills:(c.skills||[]).join("\n"),establishmentIds:c.establishmentIds||[],jobIds:c.jobIds||[],skillIds:c.skillIds||[],decisions:c.decisions||[]});setNewDecision(emptyDecision);setModal(true)};
 const addDecision=()=>{
  if(!newDecision.authority&&!newDecision.decisionRef){alert("Renseignez au moins l'autorité ou la référence de la décision.");return}
  setForm({...form,decisions:[{...newDecision,id:"dec_"+Date.now()},...form.decisions],status:newDecision.status});
  setNewDecision(emptyDecision);
 };
const save = () => {
  const payload = {
    ...form,
    objectives: String(form.objectives || "")
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean),

    skills: String(form.skills || "")
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean),

    updatedAt: new Date().toISOString().slice(0, 10),
  };

  const next = {
    ...store,

    certifications: form.id
      ? certifications.map(c =>
          c.id === form.id ? payload : c
        )
      : [
          {
            ...payload,
            id: "cert_" + Date.now(),
            createdAt: payload.updatedAt,
          },
          ...certifications,
        ],

    audit: [
      {
        id: "a_" + Date.now(),
        user: session.name,
        action: form.id ? "Modification" : "Création",
        entity: payload.title,
        oldValue: "—",
        newValue: form.decisions[0] ? `Décision : ${form.decisions[0].status}` : (payload.published ? "Publié" : "Brouillon"),
        date: new Date().toLocaleString("fr-FR"),
      },
      ...(store.audit || []),
    ],
  };

  saveStore(next);
  setStore(next);
  setModal(false);
}; const remove=id=>{if(!confirm("Supprimer cette certification ? Cette action est journalisée."))return;saveStore({...store,certifications:certifications.filter(c=>c.id!==id),audit:[{id:"a_"+Date.now(),user:session.name,action:"Suppression",entity:id,oldValue:"Présente",newValue:"Supprimée",date:new Date().toLocaleString("fr-FR")},...store.audit]});refresh()};
 const archive=c=>{saveStore({...store,certifications:certifications.map(x=>x.id===c.id?{...x,archived:true,published:false,status:"Archivée"}:x),audit:[{id:"a_"+Date.now(),user:session.name,action:"Archivage",entity:c.title,oldValue:c.status,newValue:"Archivée",date:new Date().toLocaleString("fr-FR")},...store.audit]});refresh()};
 const publish=c=>{saveStore({...store,certifications:certifications.map(x=>x.id===c.id?{...x,published:!x.published,archived:false,status:x.published?"En cours de vérification":"Vérifiée"}:x),audit:[{id:"a_"+Date.now(),user:session.name,action:c.published?"Dépublication":"Publication",entity:c.title,oldValue:c.published?"Publié":"Brouillon",newValue:c.published?"Brouillon":"Publié",date:new Date().toLocaleString("fr-FR")},...store.audit]});refresh()};
 return <div>
  <PageHeader title="Certifications" description="Créer, modifier, dupliquer, publier, dépublier, archiver et supprimer les certifications." action={<div className="flex gap-2"><Button icon={Upload} variant="secondary" onClick={()=>nav("/admin/imports")}>Importer</Button><Button icon={Plus} onClick={openCreate}>Ajouter une certification</Button></div>}/>
  <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]"><SearchBar value={q} onChange={setQ} placeholder="Nom, code, organisme, domaine..."/><Select value={status} onChange={e=>setStatus(e.target.value)} options={["Tous","Publié","Vérifiée","Déclarée par l'organisme","En cours de vérification","Expirée","Archivée"]}/></div>
  {list.length===0?<EmptyState title="Aucune certification" text="Modifiez votre recherche ou créez une nouvelle fiche."/>:<Table headers={["Certification","Type / niveau","Domaine","Statut","Mise à jour","Actions"]}>{list.map(c=><tr key={c.id} className="hover:bg-gray-50"><td className="px-5 py-4"><button onClick={()=>setView(c)} className="text-left"><p className="font-bold text-gray-900 hover:text-emerald-700">{c.title}</p><p className="text-xs text-gray-500">{c.code} · {c.organizationName}</p></button></td><td className="px-5 py-4"><p>{c.type}</p><p className="text-xs text-gray-500">{c.level}</p></td><td className="px-5 py-4 text-gray-600">{c.domain}</td><td className="px-5 py-4"><div className="space-y-1"><Badge tone={statusTone(c.status)}>{c.status}</Badge>{c.published&&<Badge tone="green">Publié</Badge>}</div></td><td className="px-5 py-4 text-gray-500">{c.updatedAt}</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button title="Publier / dépublier" onClick={()=>publish(c)} className="rounded-lg p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"><Eye size={17}/></button><button title="Dupliquer" onClick={()=>{setForm({...c,id:undefined,title:c.title+" — copie",code:c.code+"-COPY",published:false,status:"En cours de vérification",decisions:[]});setNewDecision(emptyDecision);setModal(true)}} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><Copy size={17}/></button><RowActions onEdit={()=>openEdit(c)} onArchive={!c.archived?()=>archive(c):undefined} onDelete={()=>remove(c.id)}/></div></td></tr>)}</Table>}
  <Modal open={modal} onClose={()=>setModal(false)} title={form.id?"Modifier la certification":"Nouvelle certification"} wide>
   <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    <Input label="Intitulé *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
    <Input label="Sigle" value={form.acronym} onChange={e=>setForm({...form,acronym:e.target.value})}/>
    <Input label="Code" value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/>
    <Select label="Type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} options={["Formation professionnelle et technique","Enseignement supérieur","Certification professionnelle privée","Certification professionnelle"]}/>
    <Select label="Domaine" value={form.domain} onChange={e=>setForm({...form,domain:e.target.value})} options={domains}/>
    <Input label="Sous-domaine" value={form.subdomain} onChange={e=>setForm({...form,subdomain:e.target.value})}/>
    <Select label="Niveau" value={form.level} onChange={e=>setForm({...form,level:e.target.value})} options={levels}/>
    <Input label="Niveau d'entrée" value={form.entryLevel} onChange={e=>setForm({...form,entryLevel:e.target.value})}/>
    <Input label="Niveau de sortie" value={form.exitLevel} onChange={e=>setForm({...form,exitLevel:e.target.value})}/>
    <Input label="Durée" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}/>
    <Input label="Volume horaire" value={form.hours} onChange={e=>setForm({...form,hours:e.target.value})}/>
    <Select label="Modalité" value={form.format} onChange={e=>setForm({...form,format:e.target.value})} options={["Présentiel","Distance","Hybride"]}/>
    <Select label="Statut de vérification" value={form.status} onChange={e=>setForm({...form,status:e.target.value,verificationStatus:e.target.value})} options={["Vérifiée","Déclarée par l'organisme","En cours de vérification","Expirée","Archivée"]}/>
    <Select label="Nature" value={form.nature} onChange={e=>setForm({...form,nature:e.target.value})} options={["Diplôme national","Certification professionnelle","Certification privée"]}/>
    <Select label="Organisme certificateur" value={form.organizationId} onChange={e=>{const o=organizations.find(x=>x.id===e.target.value);setForm({...form,organizationId:e.target.value,organizationName:o?.name||""})}} options={[{value:"",label:"— Choisir —"},...organizations.map(o=>({value:o.id,label:o.name}))]}/>
    <Textarea label="Description" className="md:col-span-2" rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
    <Textarea label="Objectifs — un par ligne" rows={4} value={form.objectives} onChange={e=>setForm({...form,objectives:e.target.value})}/>
    <Textarea label="Compétences — une par ligne" rows={4} value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})}/>
    <MultiSelect label="Compétences du référentiel" value={form.skillIds} onChange={v=>setForm({...form,skillIds:v})} options={skillsRef.map(s=>({value:s.id,label:s.name}))}/>
    <MultiSelect label="Débouchés — métiers accessibles" value={form.jobIds} onChange={v=>setForm({...form,jobIds:v})} options={jobs.map(j=>({value:j.id,label:j.name}))}/>
    <MultiSelect label="Où se former — établissements" value={form.establishmentIds} onChange={v=>setForm({...form,establishmentIds:v})} options={establishments.map(e=>({value:e.id,label:e.name}))}/>
   </div>

   <div className="mt-6 rounded-xl border p-4">
    <h3 className="font-bold">Décisions & sources</h3>
    <p className="mt-1 text-xs text-gray-500">Chaque décision est conservée : une nouvelle décision s'ajoute à l'historique, elle n'efface jamais les précédentes.</p>

    {form.decisions.length===0?<p className="mt-3 text-sm text-gray-400">Aucune décision enregistrée pour le moment.</p>:
    <div className="mt-3 space-y-2">{form.decisions.map(d=><div key={d.id} className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
      <Badge tone={statusTone(d.status)}>{d.status}</Badge>
      <span className="ml-2">Autorité : <b>{d.authority||"—"}</b></span>
      <span className="ml-2">Référence : <b>{d.decisionRef||"—"}</b></span>
      <span className="ml-2">Date : <b>{d.decisionDate||"—"}</b></span>
      <span className="ml-2">Validité : <b>{d.validFrom||"—"} → {d.validTo||"—"}</b></span>
      <span className="ml-2">Source : <b>{sources.find(s=>s.id===d.sourceId)?.name||"—"}</b></span>
    </div>)}</div>}

    <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg bg-emerald-50 p-3 sm:grid-cols-3">
     <Select label="Statut résultant" value={newDecision.status} onChange={e=>setNewDecision({...newDecision,status:e.target.value})} options={["Vérifiée","Déclarée par l'organisme","En cours de vérification","Expirée","Archivée"]}/>
     <Input label="Autorité" value={newDecision.authority} onChange={e=>setNewDecision({...newDecision,authority:e.target.value})}/>
     <Input label="Référence décision / arrêté" value={newDecision.decisionRef} onChange={e=>setNewDecision({...newDecision,decisionRef:e.target.value})}/>
     <Input label="Date de décision" type="date" value={newDecision.decisionDate} onChange={e=>setNewDecision({...newDecision,decisionDate:e.target.value})}/>
     <Input label="Début de validité" type="date" value={newDecision.validFrom} onChange={e=>setNewDecision({...newDecision,validFrom:e.target.value})}/>
     <Input label="Fin de validité" type="date" value={newDecision.validTo} onChange={e=>setNewDecision({...newDecision,validTo:e.target.value})}/>
     <Select label="Source / preuve" value={newDecision.sourceId} onChange={e=>setNewDecision({...newDecision,sourceId:e.target.value})} options={[{value:"",label:"— Aucune —"},...sources.map(s=>({value:s.id,label:s.name}))]}/>
     <div className="flex items-end"><Button variant="secondary" onClick={addDecision}>Ajouter la décision</Button></div>
    </div>
   </div>
   <div className="mt-6 flex flex-col gap-3 rounded-xl bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={!!form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Publier cette fiche</label><div className="flex gap-2"><Button variant="secondary" onClick={()=>setModal(false)}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div></div>
  </Modal>
  <Modal open={!!view} onClose={()=>setView(null)} title="Aperçu de la certification" wide>{view&&<div className="space-y-6"><div><div className="flex flex-wrap gap-2"><Badge tone="green">{view.domain}</Badge><Badge tone="blue">{view.level}</Badge><Badge tone="purple">{view.nature||"—"}</Badge><Badge tone={statusTone(view.status)}>{view.status}</Badge></div><h2 className="mt-3 text-2xl font-extrabold">{view.title}</h2><p className="mt-1 text-sm text-gray-500">{view.organizationName} · {view.code}</p></div><div className="grid gap-4 md:grid-cols-3">{[["Durée",view.duration||"—"],["Modalité",view.format||"—"],["Validité",latestDecision(view)?.validTo||"—"]].map(([a,b])=><div className="rounded-xl bg-gray-50 p-4" key={a}><p className="text-xs text-gray-500">{a}</p><p className="mt-1 font-bold">{b}</p></div>)}</div><div><h3 className="font-bold">Description</h3><p className="mt-2 leading-7 text-gray-600">{view.description||"—"}</p></div><div className="grid gap-6 md:grid-cols-2"><div><h3 className="font-bold">Objectifs</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">{(view.objectives||[]).map(x=><li key={x}>{x}</li>)}</ul></div><div><h3 className="font-bold">Compétences</h3><div className="mt-2 flex flex-wrap gap-2">{(view.skills||[]).map(x=><Badge key={x} tone="gray">{x}</Badge>)}{(view.skillIds||[]).map(id=>skillsRef.find(s=>s.id===id)).filter(Boolean).map(s=><Badge key={s.id} tone="blue">{s.name}</Badge>)}</div></div></div><div className="grid gap-6 md:grid-cols-2"><div><h3 className="font-bold">Débouchés — métiers</h3><div className="mt-2 flex flex-wrap gap-2">{(view.jobIds||[]).map(id=>jobs.find(j=>j.id===id)).filter(Boolean).map(j=><Badge key={j.id} tone="yellow">{j.name}</Badge>)}{(view.jobIds||[]).length===0&&<p className="text-sm text-gray-400">Aucun métier associé.</p>}</div></div><div><h3 className="font-bold">Où se former</h3><div className="mt-2 flex flex-wrap gap-2">{(view.establishmentIds||[]).map(id=>establishments.find(e=>e.id===id)).filter(Boolean).map(e=><Badge key={e.id} tone="gray">{e.name}</Badge>)}{(view.establishmentIds||[]).length===0&&<p className="text-sm text-gray-400">Aucun établissement associé.</p>}</div></div></div><div><h3 className="font-bold">Historique des décisions & sources</h3>{(view.decisions||[]).length===0?<p className="mt-2 text-sm text-gray-400">Aucune décision enregistrée.</p>:<div className="mt-2 space-y-2">{view.decisions.map(d=><div key={d.id} className="rounded-xl bg-emerald-50 p-4 text-sm"><Badge tone={statusTone(d.status)}>{d.status}</Badge><span className="ml-2">Organisme certificateur : <b>{view.organizationName||"—"}</b></span><span className="ml-2">Autorité / source : <b>{d.authority||"—"}</b></span><span className="ml-2">Référence : <b>{d.decisionRef||"—"}</b></span><span className="ml-2">Date : <b>{d.decisionDate||"—"}</b></span><span className="ml-2">Validité : <b>{d.validFrom||"—"} → {d.validTo||"—"}</b></span><span className="ml-2">Preuve : <b>{sources.find(s=>s.id===d.sourceId)?.name||"Aucune"}</b></span></div>)}</div>}</div></div>}</Modal>
 </div>
}
