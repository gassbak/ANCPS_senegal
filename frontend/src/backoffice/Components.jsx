import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, GraduationCap, Building, Menu, X, Filter } from 'lucide-react';
import { Level, Domain } from '../constants';

// --- Navbar ---
export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl tracking-wider flex items-center gap-2">
              <img src="https://picsum.photos/40/40?grayscale" alt="Logo" className="h-8 w-8 rounded bg-white/10" />
              <span>ANCPS</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="hover:bg-emerald-800 px-3 py-2 rounded-md text-sm font-medium">Accueil</Link>
                <Link to="/search" className="hover:bg-emerald-800 px-3 py-2 rounded-md text-sm font-medium">L'Annuaire</Link>
                <Link to="/about" className="hover:bg-emerald-800 px-3 py-2 rounded-md text-sm font-medium">À propos</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
             <Link to="/admin" className="bg-yellow-500 hover:bg-yellow-600 text-emerald-900 px-4 py-2 rounded-md text-sm font-bold transition-colors">
                Espace Pro
             </Link>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="bg-emerald-800 inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-emerald-700 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:bg-emerald-800 block px-3 py-2 rounded-md text-base font-medium">Accueil</Link>
            <Link to="/search" onClick={() => setIsOpen(false)} className="hover:bg-emerald-800 block px-3 py-2 rounded-md text-base font-medium">L'Annuaire</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="hover:bg-emerald-800 block px-3 py-2 rounded-md text-base font-medium">À propos</Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="bg-yellow-500 text-emerald-900 block px-3 py-2 rounded-md text-base font-bold mt-4">Espace Pro</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Footer ---
export const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-white text-lg font-bold mb-4">ANCPS</h3>
        <p className="text-sm text-gray-400">
          Le répertoire de référence des certifications professionnelles au Sénégal. 
          Une initiative pour valoriser les compétences et faciliter l'employabilité.
        </p>
      </div>
      <div>
        <h3 className="text-white text-lg font-bold mb-4">Liens Utiles</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/search" className="hover:text-white">Rechercher une formation</Link></li>
          <li><Link to="/about" className="hover:text-white">Comment ça marche ?</Link></li>
          <li><Link to="/admin" className="hover:text-white">Espace Certificateurs</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
        <p className="text-sm text-gray-400">Dakar, Sénégal</p>
        <p className="text-sm text-gray-400">contact@ancps.sn</p>
      </div>
    </div>
    <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} ANCPS Sénégal. Opéré par Bakeli.
    </div>
  </footer>
);

// --- Certification Card ---
export const CertificationCard = ({ cert }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border border-gray-100 flex flex-col h-full group">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            cert.level === Level.CERTIFICATION_PRO ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {cert.level}
          </span>
          <span className="text-xs text-gray-500">{cert.format}</span>
        </div>
        <Link to={`/certification/${cert.id}`} className="block">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 mb-1 leading-snug">
            {cert.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
           <Building size={14} /> {cert.organizationName}
        </p>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {cert.description}
        </p>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
         <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
           {cert.domain}
         </span>
         <Link to={`/certification/${cert.id}`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
           Détails <span>&rarr;</span>
         </Link>
      </div>
    </div>
  );
};

// --- Filters Component ---
export const SidebarFilters = ({ onFilterChange, activeFilters }) => {
  const domains = Object.values(Domain);
  const levels = Object.values(Level);

  const toggleFilter = (category, value) => {
    const current = activeFilters[category] || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    
    onFilterChange({ ...activeFilters, [category]: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Filter size={16} /> Domaines
        </h4>
        <div className="space-y-2">
          {domains.map((d) => (
            <label key={d} className="flex items-center text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-2"
                checked={activeFilters.domain?.includes(d)}
                onChange={() => toggleFilter('domain', d)}
              />
              {d}
            </label>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
           <GraduationCap size={16} /> Niveau
        </h4>
        <div className="space-y-2">
          {levels.map((l) => (
            <label key={l} className="flex items-center text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-2"
                checked={activeFilters.level?.includes(l)}
                onChange={() => toggleFilter('level', l)}
              />
              {l}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
