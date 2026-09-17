
import React from "react";
import { Search, Plus, X, CheckCircle2, AlertTriangle, Clock3, Archive, Trash2, Edit3, Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";

export const Button = ({children, variant="primary", icon:Icon, className="", ...props}) => {
  const styles = {
    primary:"bg-emerald-700 text-white hover:bg-emerald-800",
    secondary:"bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    warning:"bg-yellow-500 text-emerald-950 hover:bg-yellow-400",
    danger:"bg-red-600 text-white hover:bg-red-700",
    ghost:"text-gray-600 hover:bg-gray-100",
    soft:"bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
  };
  return <button className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`} {...props}>{Icon && <Icon size={16}/>} {children}</button>
};

export const Badge = ({children, tone="gray"}) => {
  const tones = {
    green:"bg-emerald-100 text-emerald-800", yellow:"bg-yellow-100 text-yellow-800",
    red:"bg-red-100 text-red-800", blue:"bg-blue-100 text-blue-800", gray:"bg-gray-100 text-gray-700",
    purple:"bg-purple-100 text-purple-800"
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]||tones.gray}`}>{children}</span>
};

export const statusTone = (status="") => {
  const s=status.toLowerCase();
  if (s.includes("vérifi")) return "green";
  if (s.includes("publi")) return "green";
  if (s.includes("attente") || s.includes("cours") || s.includes("déclar")) return "yellow";
  if (s.includes("expir") || s.includes("rejet")) return "red";
  if (s.includes("archiv")) return "gray";
  return "blue";
};

export const Modal = ({open,title,children,onClose,wide=false}) => !open ? null : (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
    <div className={`w-full ${wide?"max-w-5xl":"max-w-2xl"} max-h-[92vh] overflow-auto rounded-2xl bg-white shadow-2xl`}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100"><X size={20}/></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export const Input = ({label, ...props}) => <label className="block text-sm">
  {label && <span className="mb-1.5 block font-semibold text-gray-700">{label}</span>}
  <input {...props} className={`w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${props.className||""}`}/>
</label>;

export const Select = ({label, options=[], ...props}) => <label className="block text-sm">
  {label && <span className="mb-1.5 block font-semibold text-gray-700">{label}</span>}
  <select {...props} className={`w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${props.className||""}`}>
    {options.map(o => typeof o==="string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
</label>;

export const Textarea = ({label, ...props}) => <label className="block text-sm">
  {label && <span className="mb-1.5 block font-semibold text-gray-700">{label}</span>}
  <textarea {...props} className={`w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${props.className||""}`}/>
</label>;

export const MultiSelect = ({label, options=[], value=[], onChange}) => <label className="block text-sm">
  {label && <span className="mb-1.5 block font-semibold text-gray-700">{label}</span>}
  <div className="max-h-40 space-y-0.5 overflow-auto rounded-lg border border-gray-300 p-2">
    {options.length===0 && <p className="px-1 text-xs text-gray-400">Aucune option — à ajouter dans le référentiel.</p>}
    {options.map(o => <label key={o.value} className="flex items-center gap-2 rounded px-1 py-1 hover:bg-gray-50">
      <input type="checkbox" checked={value.includes(o.value)} onChange={()=>onChange(value.includes(o.value)?value.filter(v=>v!==o.value):[...value,o.value])}/>
      <span>{o.label}</span>
    </label>)}
  </div>
</label>;

export const StatCard = ({label,value,icon:Icon, tone="emerald", detail}) => {
  const map={emerald:"bg-emerald-50 text-emerald-700",blue:"bg-blue-50 text-blue-700",yellow:"bg-yellow-50 text-yellow-700",red:"bg-red-50 text-red-700"};
  return <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between"><div><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-extrabold text-gray-900">{value}</p>{detail&&<p className="mt-1 text-xs text-gray-500">{detail}</p>}</div><div className={`rounded-xl p-3 ${map[tone]}`}><Icon size={22}/></div></div>
  </div>
};

export const EmptyState = ({title="Aucun élément",text="Aucune donnée ne correspond à votre recherche."}) => <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center"><div className="mx-auto mb-3 w-fit rounded-full bg-white p-3 shadow-sm"><Search className="text-gray-400"/></div><h3 className="font-bold text-gray-800">{title}</h3><p className="mt-1 text-sm text-gray-500">{text}</p></div>;

export const PageHeader = ({title,description,action}) => <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{title}</h1>{description&&<p className="mt-1 text-sm text-gray-500">{description}</p>}</div>{action}</div>;

export const SearchBar = ({value,onChange,placeholder="Rechercher..."}) => <div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={18}/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"/></div>;

export const Confirm = ({children,onConfirm}) => <button onClick={()=>window.confirm(children||"Confirmer cette action ?") && onConfirm()}>{null}</button>;

export const EmptyAction = ({children}) => children;

export const Table = ({headers,children}) => <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr>{headers.map(h=><th key={h} className="px-5 py-3.5">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{children}</tbody></table></div>;
export const RowActions = ({onView,onEdit,onDelete,onArchive}) => <div className="flex items-center justify-end gap-1">{onView&&<button title="Voir" onClick={onView} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-emerald-700"><Eye size={17}/></button>}{onEdit&&<button title="Modifier" onClick={onEdit} className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-700"><Edit3 size={17}/></button>}{onArchive&&<button title="Archiver" onClick={onArchive} className="rounded-lg p-2 text-gray-500 hover:bg-yellow-50 hover:text-yellow-700"><Archive size={17}/></button>}{onDelete&&<button title="Supprimer" onClick={onDelete} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-700"><Trash2 size={17}/></button>}</div>;

export const Empty = ({children}) => <>{children}</>;
