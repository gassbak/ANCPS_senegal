
import React,{useMemo,useState} from "react";
import * as XLSX from "xlsx";
import {Upload, CheckCircle2, AlertTriangle, FileSpreadsheet} from "lucide-react";
import {loadStore,saveStore} from "../services/adminData";
import {PageHeader,Button,Select,Badge,Table,EmptyState} from "../components/AdminUI";

const fields=["title","organizationName","domain","level","duration","status"];
const labels={title:"Certification",organizationName:"Organisme",domain:"Domaine / sous-domaine",level:"Niveau",duration:"Durée",status:"Statut"};

export default function ImportPage({session}){
 const [rows,setRows]=useState([]),[headers,setHeaders]=useState([]),[mapping,setMapping]=useState({}),[errors,setErrors]=useState([]),[done,setDone]=useState(false);
 const onFile=e=>{const f=e.target.files?.[0];if(!f)return;const reader=new FileReader();reader.onload=ev=>{try{const wb=XLSX.read(ev.target.result,{type:"array"});const ws=wb.Sheets[wb.SheetNames[0]];const data=XLSX.utils.sheet_to_json(ws,{defval:""});const h=data.length?Object.keys(data[0]):[];setHeaders(h);setRows(data);const auto={};fields.forEach(k=>{auto[k]=h.find(x=>x.toLowerCase().includes(k==="title"?"diplôme":k==="organizationName"?"école":k))||""});setMapping(auto);setErrors([]);setDone(false)}catch{setErrors(["Fichier illisible."])}};reader.readAsArrayBuffer(f)};
const preview = useMemo(
  () =>
    rows.map((r, i) => {
      const obj = {};

      fields.forEach((f) => {
        obj[f] = r[mapping[f]] ?? "";
      });

      return {
        ...obj,
        _row: i + 2,
        _duplicate:
          obj.title &&
          rows
            .slice(0, i)
            .some(
              (x) =>
                (x[mapping.title] || "").toLowerCase().trim() ===
                obj.title.toLowerCase().trim()
            ),
        _invalid: !obj.title,
      };
    }),
  [rows, mapping]
);
 const validate=()=>{const e=preview.filter(x=>x._invalid||x._duplicate).map(x=>`Ligne ${x._row}: ${x._invalid?"intitulé manquant":""}${x._duplicate?" doublon détecté":""}`);setErrors(e)};
 const importNow=()=>{validate();if(preview.some(x=>x._invalid||x._duplicate))return;const s=loadStore();const added=preview.map((x,i)=>({id:"cert_imp_"+Date.now()+"_"+i,title:x.title,organizationName:x.organizationName,domain:x.domain||"Non classé",level:x.level||"Non renseigné",duration:x.duration,status:x.status||"En cours de vérification",verificationStatus:x.status||"En cours de vérification",published:false,archived:false,updatedAt:new Date().toISOString().slice(0,10),createdAt:new Date().toISOString().slice(0,10),objectives:[],skills:[],establishmentIds:[],jobIds:[],skillIds:[],decisions:[]}));saveStore({...s,certifications:[...added,...s.certifications],audit:[{id:"a_"+Date.now(),user:session.name,action:"Import massif",entity:`${added.length} certifications`,oldValue:"—",newValue:"Importé",date:new Date().toLocaleString("fr-FR")},...s.audit]});setDone(true)};
 return <div><PageHeader title="Import massif" description="CSV / Excel : mapping des colonnes, prévisualisation, validation, doublons et rapport d'erreurs."/>
 <div className="grid gap-6 lg:grid-cols-3"><div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-1"><div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center"><FileSpreadsheet className="mx-auto text-emerald-700" size={35}/><p className="mt-3 font-bold">Déposer un CSV ou Excel</p><p className="mt-1 text-xs text-gray-500">La première feuille est utilisée.</p><label className="mt-5 inline-flex cursor-pointer"><span className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white">Choisir un fichier</span><input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={onFile}/></label></div>
 {headers.length>0&&<div className="mt-6 space-y-3"><h3 className="font-bold">Mapping</h3>{fields.map(f=><Select key={f} label={labels[f]} value={mapping[f]||""} onChange={e=>setMapping({...mapping,[f]:e.target.value})} options={["",...headers]}/>)}</div>}</div>
 <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold">Prévisualisation</h2><p className="text-sm text-gray-500">{rows.length} ligne(s) détectée(s).</p></div>{rows.length>0&&<div className="flex gap-2"><Button variant="secondary" onClick={validate}><AlertTriangle size={16}/> Valider</Button><Button onClick={importNow}><Upload size={16}/> Importer</Button></div>}</div>
 {errors.length>0&&<div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800"><b>Rapport d'erreurs</b><ul className="mt-2 list-disc pl-5">{errors.slice(0,15).map(e=><li key={e}>{e}</li>)}</ul></div>}
 {done&&<div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={18}/> Import terminé. Les fiches sont créées en brouillon pour vérification avant publication.</div>}
 {rows.length===0?<div className="mt-10"><EmptyState title="Aucun fichier importé" text="Chargez un fichier pour commencer le mapping."/></div>:<div className="mt-5 overflow-auto"><Table headers={fields.map(f=>labels[f]).concat(["Contrôles"])}>{preview.slice(0,100).map(r=><tr key={r._row} className={r._invalid||r._duplicate?"bg-red-50":""}>{fields.map(f=><td key={f} className="px-4 py-3 text-xs">{r[f]||"—"}</td>)}<td className="px-4 py-3">{r._invalid?<Badge tone="red">Invalide</Badge>:r._duplicate?<Badge tone="yellow">Doublon</Badge>:<Badge tone="green">OK</Badge>}</td></tr>)}</Table></div>}</div></div></div>
}
