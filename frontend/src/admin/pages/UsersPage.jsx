import {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  UserPlus,
  Trash2
} from "lucide-react";

import { roles } from "../services/adminStore";

import {
  loadUsers,
  saveUser,
  deleteUser
} from "../services/adminApi";

import {
  PageHeader,
  Button,
  Badge,
  Table,
  Modal,
  Input,
  Select
} from "../components/ui";


export default function UsersPage() {

  const [users, setUsers] =
    useState([]);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [form, setForm] =
    useState({});

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);


  // ===============================
  // CHARGER LES UTILISATEURS
  // ===============================
  const reload = useCallback(
    async () => {
      try {
        const data =
          await loadUsers();

        setUsers(data);

      } catch (error) {
        alert(error.message);
      }
    },
    []
  );


  useEffect(() => {
    reload();
  }, [reload]);


  // ===============================
  // OUVRIR LE FORMULAIRE
  // ===============================
  const openForm = (user) => {

    if (user) {

      setForm({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        role:
          user.role ||
          roles[0],
        password: ""
      });

    } else {

      setForm({
        name: "",
        email: "",
        password: "",
        role:
          roles[0]
      });
    }

    setModalOpen(true);
  };


  // ===============================
  // FERMER LE FORMULAIRE
  // ===============================
  const closeForm = () => {

    if (saving) {
      return;
    }

    setModalOpen(false);
    setForm({});
  };


  // ===============================
  // ENREGISTRER
  // ===============================
  const save = async () => {

    if (!form.name?.trim()) {
      alert("Le nom est obligatoire");
      return;
    }

    if (!form.email?.trim()) {
      alert("L'email est obligatoire");
      return;
    }

    if (!form.id && !form.password) {
      alert(
        "Le mot de passe est obligatoire"
      );
      return;
    }

    if (
      !form.id &&
      form.password.length < 6
    ) {
      alert(
        "Le mot de passe doit contenir au moins 6 caractères"
      );
      return;
    }

    try {

      setSaving(true);

      await saveUser(form);

      setModalOpen(false);
      setForm({});

      await reload();

    } catch (error) {

      alert(error.message);

    } finally {

      setSaving(false);
    }
  };


  // ===============================
  // SUPPRIMER
  // ===============================
  const remove = async (user) => {

    const confirmed =
      window.confirm(
        `Voulez-vous vraiment supprimer l'utilisateur "${user.name}" ?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(true);

      await deleteUser(user.id);

      await reload();

    } catch (error) {

      alert(error.message);

    } finally {

      setDeleting(false);
    }
  };


  return (
    <div>

      <PageHeader
        title="Utilisateurs & rôles"
        description="Contrôle des accès au back-office par rôle et permission."
        action={
          <Button
            icon={UserPlus}
            onClick={() =>
              openForm(null)
            }
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
          "Actions"
        ]}
      >

        {users.length === 0 ? (

          <tr>
            <td
              colSpan="5"
              className="px-5 py-8 text-center text-gray-500"
            >
              Aucun utilisateur
              trouvé.
            </td>
          </tr>

        ) : (

          users.map((u) => (

            <tr key={u.id}>

              <td className="px-5 py-4 font-bold">
                {u.name}
              </td>


              <td className="px-5 py-4">
                {u.email}
              </td>


              <td className="px-5 py-4">
                <Badge tone="blue">
                  {u.role}
                </Badge>
              </td>


              <td className="px-5 py-4">
                <Badge tone="green">
                  {u.status ||
                    "Actif"}
                </Badge>
              </td>


              <td className="px-5 py-4">

                <div className="flex justify-end gap-2">

                  <Button
                    variant="ghost"
                    onClick={() =>
                      openForm(u)
                    }
                  >
                    Modifier
                  </Button>


                  <Button
                    variant="ghost"
                    icon={Trash2}
                    disabled={deleting}
                    onClick={() =>
                      remove(u)
                    }
                  >
                    Supprimer
                  </Button>

                </div>

              </td>

            </tr>

          ))

        )}

      </Table>


      <Modal
        open={modalOpen}
        onClose={closeForm}
        title={
          form.id
            ? "Modifier l'utilisateur"
            : "Ajouter un utilisateur"
        }
      >

        <div className="space-y-4">

          <Input
            label="Nom"
            value={
              form.name || ""
            }
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />


          <Input
            label="Email"
            type="email"
            value={
              form.email || ""
            }
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />


          <Input
            label={
              form.id
                ? "Nouveau mot de passe"
                : "Mot de passe"
            }
            type="password"
            value={
              form.password || ""
            }
            placeholder={
              form.id
                ? "Laisser vide pour conserver l'ancien"
                : ""
            }
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value
              })
            }
          />


          <Select
            label="Rôle"
            value={
              form.role ||
              roles[0]
            }
            onChange={(e) =>
              setForm({
                ...form,
                role:
                  e.target.value
              })
            }
            options={roles}
          />


          <div className="flex justify-end gap-2">

            <Button
              variant="secondary"
              disabled={saving}
              onClick={closeForm}
            >
              Annuler
            </Button>


            <Button
              disabled={saving}
              onClick={save}
            >
              {saving
                ? "Enregistrement..."
                : "Enregistrer"}
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  );
}