import React, { useState } from "react";
import { Bell, Check, UserPlus, RefreshCw, Save } from "lucide-react";
import { loadStore, saveStore, roles } from "../services/adminData";
import {
  PageHeader,
  Button,
  Badge,
  Table,
  Modal,
  Input,
  Select,
  Textarea,
} from "../components/AdminUI";

// NOTIFICATIONS
export function NotificationsPage() {
  const [s, setS] = useState(loadStore() || {});
  const notifications = s.notifications || [];

  const mark = (n) => {
    const next = {
      ...s,
      notifications: notifications.map((x) =>
        x.id === n.id ? { ...x, read: true } : x
      ),
    };

    saveStore(next);
    setS(next);
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Contributions, documents manquants et échéances."
        action={
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={() => setS(loadStore() || {})}
          >
            Actualiser
          </Button>
        }
      />

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl border bg-white p-5 shadow-sm ${
              n.read ? "opacity-60" : ""
            }`}
          >
            <div className="flex gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <Bell />
              </div>

              <div className="flex-1">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{n.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{n.text}</p>
                  </div>

                  {!n.read && (
                    <Button
                      variant="soft"
                      icon={Check}
                      onClick={() => mark(n)}
                    >
                      Marquer lu
                    </Button>
                  )}
                </div>

                <p className="mt-3 text-xs text-gray-400">{n.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// UTILISATEURS
export function UsersPage({ session }) {
  const [s, setS] = useState(loadStore() || {});
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const users = s.users || [];

  const save = () => {
    const user = {
      ...form,
      id: form.id || "usr_" + Date.now(),
      status: "Actif",
      lastLogin: "Jamais",
    };

    const next = {
      ...s,
      users: form.id
        ? users.map((x) => (x.id === form.id ? user : x))
        : [user, ...users],

      audit: [
        {
          id: "a_" + Date.now(),
          user: session.name,
          action: "Gestion utilisateur",
          entity: user.email,
          oldValue: "—",
          newValue: user.role,
          date: new Date().toLocaleString("fr-FR"),
        },
        ...(s.audit || []),
      ],
    };

    saveStore(next);
    setS(next);
    setModal(false);
  };

  return (
    <div>
      <PageHeader
        title="Utilisateurs & rôles"
        description="Contrôle des accès au back-office par rôle et permission."
        action={
          <Button
            icon={UserPlus}
            onClick={() => {
              setForm({});
              setModal(true);
            }}
          >
            Ajouter un utilisateur
          </Button>
        }
      />

      <Table
        headers={[
          "Utilisateur",
          "Email",
          "Rôle",
          "Statut",
          "Dernière connexion",
          "Actions",
        ]}
      >
        {users.map((u) => (
          <tr key={u.id}>
            <td className="px-5 py-4 font-bold">{u.name}</td>
            <td className="px-5 py-4">{u.email}</td>

            <td className="px-5 py-4">
              <Badge tone="blue">{u.role}</Badge>
            </td>

            <td className="px-5 py-4">
              <Badge tone="green">{u.status}</Badge>
            </td>

            <td className="px-5 py-4 text-gray-500">{u.lastLogin}</td>

            <td className="px-5 py-4 text-right">
              <Button
                variant="ghost"
                onClick={() => {
                  setForm(u);
                  setModal(true);
                }}
              >
                Modifier
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Utilisateur"
      >
        <div className="space-y-4">
          <Input
            label="Nom"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            label="Email"
            type="email"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Select
            label="Rôle"
            value={form.role || roles[0]}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={roles}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setModal(false)}
            >
              Annuler
            </Button>

            <Button onClick={save}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// PARAMÈTRES
export function SettingsPage() {
  const [s, setS] = useState(loadStore() || {});

  const valuesDefault = {
    domains: s.domains || [],
    subdomains: s.subdomains || [],
    levels: s.levels || [],
    certificationTypes: s.certificationTypes || [],
    verificationStatuses: s.verificationStatuses || [],
    natures: s.natures || [],
    modalities: s.modalities || [],
    regions: s.regions || [],
    recognitionTypes: s.recognitionTypes || [],
    authorities: s.authorities || [],
  };

  const [values, setValues] = useState(
    Object.fromEntries(
      Object.entries(valuesDefault).map(([key, value]) => [
        key,
        value.join("\n"),
      ])
    )
  );

  const meta = [
    ["domains", "Domaines", "Secteurs d'activité."],
    ["subdomains", "Sous-domaines", "Nomenclature des domaines."],
    ["certificationTypes", "Types de certification", "Types de certification."],
    ["levels", "Niveaux", "Niveaux d'entrée / sortie."],
    ["verificationStatuses", "Statuts", "Statuts de vérification."],
    ["natures", "Natures", "Nature des certifications."],
    ["modalities", "Modalités", "Présentiel, distance, hybride."],
    ["regions", "Régions", "Référentiel territorial."],
    ["recognitionTypes", "Types de reconnaissance", "Reconnaissance et accréditation."],
    ["authorities", "Autorités", "Organismes de référence."],
  ];

  const save = () => {
    const next = { ...s };

    Object.entries(values).forEach(([key, value]) => {
      next[key] = value
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
    });

    saveStore(next);
    setS(next);
    alert("Paramètres enregistrés");
  };

  return (
    <div>
      <PageHeader
        title="Paramétrage"
        description="Nomenclatures administrables sans intervention technique."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {meta.map(([key, title, desc]) => (
          <div
            key={key}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <h2 className="font-bold">{title}</h2>
            <p className="mt-1 text-xs text-gray-500">{desc}</p>

            <Textarea
              className="mt-4"
              rows={7}
              value={values[key] || ""}
              onChange={(e) =>
                setValues({
                  ...values,
                  [key]: e.target.value,
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button icon={Save} onClick={save}>
          Enregistrer les paramètres
        </Button>
      </div>
    </div>
  );
}