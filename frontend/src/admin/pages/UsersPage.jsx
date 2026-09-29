import { useCallback, useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { roles } from "../services/adminStore";
import { loadUsers, saveUser } from "../services/adminApi";
import { PageHeader, Button, Badge, Table, Modal, Input, Select } from "../components/ui";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({});

  const reload = useCallback(async () => {
    try {
      setUsers(await loadUsers());
    } catch (error) {
      alert(error.message);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = async () => {
    try {
      await saveUser(form);
      setModalOpen(false);
      await reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const openForm = (user) => {
    setForm(user || { role: roles[0] });
    setModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Utilisateurs & rôles"
        description="Contrôle des accès au back-office par rôle et permission."
        action={<Button icon={UserPlus} onClick={() => openForm(null)}>Ajouter un utilisateur</Button>}
      />

      <Table headers={["Utilisateur", "Email", "Rôle", "Statut", "Actions"]}>
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
            <td className="px-5 py-4 text-right">
              <Button variant="ghost" onClick={() => openForm(u)}>Modifier</Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Utilisateur">
        <div className="space-y-4">
          <Input label="Nom" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input
            label="Email"
            type="email"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {!form.id && (
            <Input
              label="Mot de passe"
              type="password"
              value={form.password || ""}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}
          <Select
            label="Rôle"
            value={form.role || roles[0]}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={roles}
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={save}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}