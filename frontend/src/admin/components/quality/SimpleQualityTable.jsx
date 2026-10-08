
import { useState } from "react";
import { FileText } from "lucide-react";

import { loadStore, saveStore } from "../../services/adminStore";
import { makeAuditEntry, withAuditEntry } from "../../utils/audit";

import {
  PageHeader,
  Button,
  SearchBar,
  Table,
  Badge,
  Modal,
  Input,
  Select,
  statusTone,
  EmptyState,
} from "../ui";

// Page générique utilisée pour les référentiels
// Sources et Documents.
//
// Elle permet :
// - d'afficher les données
// - de rechercher
// - d'ajouter
// - de modifier
// - de lier un élément à une certification
// - d'enregistrer une trace dans l'audit

export default function SimpleQualityTable({
  title = "Référentiel",
  description = "",
  storeKey = "",
  columns = [],
  session = {},
  itemType = "élément",
}) {
  // --------------------------------------------------
  // ÉTAT DU STORE
  // --------------------------------------------------

  const [store, setStore] = useState(() => {
    const savedStore = loadStore();

    // On garantit toujours un objet
    if (!savedStore || typeof savedStore !== "object") {
      return {};
    }

    return savedStore;
  });

  // --------------------------------------------------
  // ÉTATS DE LA PAGE
  // --------------------------------------------------

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({});

  // --------------------------------------------------
  // DONNÉES
  // --------------------------------------------------

  // On vérifie que store[storeKey] est bien un tableau
  const data = Array.isArray(store?.[storeKey])
    ? store[storeKey]
    : [];

  // Même protection pour les certifications
  const certifications = Array.isArray(store?.certifications)
    ? store.certifications
    : [];

  // --------------------------------------------------
  // RECHERCHE
  // --------------------------------------------------

  const searchText = String(query || "")
    .trim()
    .toLowerCase();

  const list = data.filter((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    if (!searchText) {
      return true;
    }

    return Object.values(item)
      .map((value) => {
        if (value === null || value === undefined) {
          return "";
        }

        if (typeof value === "object") {
          try {
            return JSON.stringify(value);
          } catch {
            return "";
          }
        }

        return String(value);
      })
      .join(" ")
      .toLowerCase()
      .includes(searchText);
  });

  // --------------------------------------------------
  // OUVRIR LE FORMULAIRE
  // --------------------------------------------------

  const openForm = (item = null) => {
    if (item && typeof item === "object") {
      setForm({
        ...item,
      });
    } else {
      setForm({});
    }

    setModalOpen(true);
  };

  // --------------------------------------------------
  // CHANGER UNE VALEUR DU FORMULAIRE
  // --------------------------------------------------

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // --------------------------------------------------
  // NOM DE L'ÉLÉMENT
  // --------------------------------------------------

  const getItemName = (item) => {
    if (!item || typeof item !== "object") {
      return "Élément sans nom";
    }

    return (
      item.name ||
      item.nom ||
      item.title ||
      item.titre ||
      `${itemType} sans nom`
    );
  };

  // --------------------------------------------------
  // NOM D'UNE COLONNE
  // --------------------------------------------------

  const getColumnLabel = (column) => {
    if (!column) {
      return "";
    }

    const text = String(column);

    return text
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (letter) => letter.toUpperCase())
      .trim();
  };

  // --------------------------------------------------
  // FORMATAGE D'UNE VALEUR
  // --------------------------------------------------

  const getDisplayValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    if (typeof value === "object") {
      if (value.name) {
        return value.name;
      }

      if (value.nom) {
        return value.nom;
      }

      if (value.title) {
        return value.title;
      }

      try {
        return JSON.stringify(value);
      } catch {
        return "—";
      }
    }

    return String(value);
  };

  // --------------------------------------------------
  // TROUVER UNE CERTIFICATION
  // --------------------------------------------------

  const getCertificationTitle = (certificationId) => {
    if (!certificationId) {
      return "—";
    }

    const certification = certifications.find((certification) => {
      if (!certification) {
        return false;
      }

      return (
        certification.id === certificationId ||
        certification._id === certificationId
      );
    });

    if (!certification) {
      return "—";
    }

    return (
      certification.title ||
      certification.titre ||
      certification.name ||
      certification.nom ||
      "Certification sans nom"
    );
  };

  // --------------------------------------------------
  // ENREGISTRER
  // --------------------------------------------------

  const save = () => {
    // On récupère l'identifiant existant
    // ou on en crée un nouveau.
    const itemId =
      form?.id ||
      form?._id ||
      `${itemType}_${Date.now()}`;

    const item = {
      ...form,
      id: itemId,
    };

    // Vérifie si on est en modification
    const isEditing = Boolean(form?.id || form?._id);

    let updatedData;

    if (isEditing) {
      updatedData = data.map((existingItem) => {
        if (!existingItem) {
          return existingItem;
        }

        const existingId =
          existingItem.id || existingItem._id;

        const currentId =
          form.id || form._id;

        if (existingId === currentId) {
          return {
            ...existingItem,
            ...item,
          };
        }

        return existingItem;
      });
    } else {
      updatedData = [item, ...data];
    }

    // --------------------------------------------------
    // AUDIT
    // --------------------------------------------------

    const currentAudit = Array.isArray(store?.audit)
      ? store.audit
      : [];

    // Protection contre session undefined
    const userName =
      session?.name ||
      session?.nom ||
      session?.username ||
      session?.email ||
      "Utilisateur";

    const auditEntry = makeAuditEntry({
      user: userName,
      action: isEditing ? "Modification" : "Ajout",
      entity: getItemName(item),
      newValue: "Enregistré",
    });

    const next = {
      ...store,

      [storeKey]: updatedData,

      audit: withAuditEntry(
        currentAudit,
        auditEntry
      ),
    };

    // Sauvegarde locale
    saveStore(next);

    // Mise à jour de l'état React
    setStore(next);

    // Ferme la fenêtre
    setModalOpen(false);

    // Réinitialise le formulaire
    setForm({});
  };

  // --------------------------------------------------
  // ANNULER
  // --------------------------------------------------

  const closeModal = () => {
    setModalOpen(false);
    setForm({});
  };

  // --------------------------------------------------
  // RENDU
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* --------------------------------------------- */}
      {/* EN-TÊTE */}
      {/* --------------------------------------------- */}

      <PageHeader
        title={title}
        description={description}
        action={
          <Button
            icon={FileText}
            onClick={() => openForm(null)}
          >
            Ajouter
          </Button>
        }
      />

      {/* --------------------------------------------- */}
      {/* RECHERCHE */}
      {/* --------------------------------------------- */}

      <div className="mb-5">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={`Rechercher dans ${
            String(title || "").toLowerCase()
          }...`}
        />
      </div>

      {/* --------------------------------------------- */}
      {/* LISTE */}
      {/* --------------------------------------------- */}

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <Table
            headers={[
              ...columns.map(getColumnLabel),
              "Certification liée",
              "Actions",
            ]}
          >
            {list.map((item, index) => {
              if (!item) {
                return null;
              }

              const itemId =
                item.id ||
                item._id ||
                `${storeKey}_${index}`;

              return (
                <tr
                  key={itemId}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  {/* -------------------------------- */}
                  {/* COLONNES */}
                  {/* -------------------------------- */}

                  {columns.map((column) => {
                    const value = item?.[column];

                    return (
                      <td
                        key={column}
                        className="px-5 py-4 text-gray-600"
                      >
                        {column === "status" ? (
                          <Badge
                            tone={statusTone(
                              value || ""
                            )}
                          >
                            {getDisplayValue(value)}
                          </Badge>
                        ) : (
                          getDisplayValue(value)
                        )}
                      </td>
                    );
                  })}

                  {/* -------------------------------- */}
                  {/* CERTIFICATION */}
                  {/* -------------------------------- */}

                  <td className="px-5 py-4 text-gray-500">
                    {getCertificationTitle(
                      item?.certificationId
                    )}
                  </td>

                  {/* -------------------------------- */}
                  {/* ACTIONS */}
                  {/* -------------------------------- */}

                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      onClick={() => openForm(item)}
                    >
                      Modifier
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table>
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* MODALE */}
      {/* --------------------------------------------- */}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          form?.id || form?._id
            ? `Modifier ${itemType}`
            : `Ajouter ${itemType}`
        }
      >
        <div className="space-y-4">
          {/* ----------------------------------------- */}
          {/* CHAMPS */}
          {/* ----------------------------------------- */}

          {columns.map((column) => {
            const value = form?.[column];

            return (
              <Input
                key={column}
                label={getColumnLabel(column)}
                value={
                  value === null ||
                  value === undefined
                    ? ""
                    : String(value)
                }
                onChange={(e) =>
                  updateField(
                    column,
                    e.target.value
                  )
                }
              />
            );
          })}

          {/* ----------------------------------------- */}
          {/* CERTIFICATION */}
          {/* ----------------------------------------- */}

          <Select
            label="Certification liée"
            value={form?.certificationId || ""}
            onChange={(e) =>
              updateField(
                "certificationId",
                e.target.value
              )
            }
            options={[
              {
                value: "",
                label: "— Aucune —",
              },

              ...certifications
                .filter(
                  (certification) =>
                    certification &&
                    (
                      certification.id ||
                      certification._id
                    )
                )
                .map((certification) => ({
                  value:
                    certification.id ||
                    certification._id,

                  label:
                    certification.title ||
                    certification.titre ||
                    certification.name ||
                    certification.nom ||
                    "Certification sans nom",
                })),
            ]}
          />

          {/* ----------------------------------------- */}
          {/* BOUTONS */}
          {/* ----------------------------------------- */}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={closeModal}
            >
              Annuler
            </Button>

            <Button onClick={save}>
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
