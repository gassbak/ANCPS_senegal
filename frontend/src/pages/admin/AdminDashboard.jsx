import StatCard from "../../components/admin/StatCard";
import VerificationList from "../../components/admin/VerificationList";
import RecentActivity from "../../components/admin/RecentActivity";

const statistics = [
  { title: "Certifications publiées", value: "124", icon: "🎓", description: "Certifications actives dans le référentiel" },
  { title: "En attente de vérification", value: "12", icon: "📋", description: "Demandes à traiter par les vérificateurs" },
  { title: "Établissements", value: "86", icon: "🏫", description: "Établissements et centres référencés" },
  { title: "Organismes", value: "42", icon: "🏢", description: "Organismes certificateurs référencés" },
  { title: "Fiches vérifiées", value: "91%", icon: "✅", description: "Objectif de lancement : plus de 90 % (§19.2)" },
  { title: "Échéances à 30 jours", value: "3", icon: "⏰", description: "Accréditations arrivant à expiration" },
  { title: "Documents à vérifier", value: "7", icon: "📄", description: "Justificatifs en attente de contrôle" },
  { title: "Recherches ce mois", value: "8 430", icon: "🔍", description: "Volume de recherches sur la plateforme" },
];

function AdminDashboard() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Vue d'ensemble du back-office ANCPS (§11.1, §20).</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} description={stat.description} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VerificationList />
        <RecentActivity />
      </div>
    </div>
  );
}

export default AdminDashboard;