
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Badge from "../components/ui/Badge";
import { api } from "../services/api";
import { downloadCertificationPDF } from "../utils/generateCertificationPDF";

export default function CertificationDetail() {
    const { id } = useParams();

    const [certification, setCertification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCertification() {
            try {
                const data = await api.getCertification(id);
                setCertification(data);
            } catch (error) {
                console.error(error);
                setError(
                    "Impossible de charger cette certification."
                );
            } finally {
                setLoading(false);
            }
        }

        loadCertification();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="px-6 pt-[130px]">
                    <div className="mx-auto max-w-[1220px]">
                        <p className="text-slate-500">
                            Chargement de la certification...
                        </p>
                    </div>
                </main>
            </>
        );
    }

    if (error || !certification) {
        return (
            <>
                <Navbar />
                <main className="px-6 pt-[130px]">
                    <div className="mx-auto max-w-[1220px]">
                        <div className="rounded-lg border bg-white p-8">
                            <h1 className="text-xl font-bold">
                                Certification introuvable
                            </h1>

                            <p className="mt-2 text-slate-500">
                                {error}
                            </p>

                            <Link
                                to="/annuaire"
                                className="mt-5 inline-block font-semibold text-emerald-700"
                            >
                                ← Retour à l'annuaire
                            </Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    const organisme =
        certification.organisme?.nom ||
        "Organisme non renseigné";

    const niveau =
        certification.niveau ||
        certification.niveauSortie?.nom ||
        "Non renseigné";

    const duree =
        certification.duree ||
        "Non renseignée";

    const modalite =
        certification.modalite ||
        "Non renseignée";

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            <main className="pt-[74px]">

                {/* En-tête */}
                <section className="border-b bg-white">
                    <div className="mx-auto max-w-[1220px] px-6 py-10">

                        <Link
                            to="/annuaire"
                            className="text-sm font-medium text-emerald-700"
                        >
                            ← Retour à l'annuaire
                        </Link>

                        <div className="mt-7 flex flex-wrap gap-2">
                            <Badge variant="green">
                                {certification.type?.nom ||
                                    certification.nature?.nom ||
                                    "Certification"}
                            </Badge>

                            <Badge variant="blue">
                                {niveau}
                            </Badge>
                        </div>

                        <h1 className="mt-4 max-w-[850px] text-[38px] font-bold leading-tight">
                            {certification.title}
                        </h1>

                        <p className="mt-4 text-[16px] text-slate-600">
                            {organisme}
                        </p>

                        <p className="mt-1 text-[14px] text-slate-500">
                            Sénégal
                        </p>

                        <button
                            onClick={() =>
                                downloadCertificationPDF(
                                    certification
                                )
                            }
                            className="mt-6 rounded-md bg-[#064E3B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#053c2e]"
                        >
                            Télécharger la fiche PDF
                        </button>
                    </div>
                </section>

                {/* Contenu */}
                <section className="px-6 py-10">
                    <div className="mx-auto grid max-w-[1220px] gap-8 lg:grid-cols-[1fr_320px]">

                        {/* Colonne principale */}
                        <div className="space-y-7">

                            <InfoSection title="Présentation">
                                {certification.description ||
                                    "Aucune description disponible."}
                            </InfoSection>

                            <InfoSection title="Objectifs de la formation">
                                {certification.objectifs ||
                                    "Les objectifs de cette certification ne sont pas encore renseignés."}
                            </InfoSection>

                            <section className="rounded-lg border border-slate-200 bg-white p-7">
                                <h2 className="text-[22px] font-bold">
                                    Blocs de compétences
                                </h2>

                                {certification.competencesLibres?.length ? (
                                    <ul className="mt-4 space-y-3">
                                        {certification.competencesLibres.map(
                                            (competence, index) => (
                                                <li
                                                    key={index}
                                                    className="rounded-md bg-slate-50 px-4 py-3 text-slate-600"
                                                >
                                                    {competence}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="mt-4 text-slate-500">
                                        Aucun bloc de compétences renseigné.
                                    </p>
                                )}
                            </section>

                            <section className="rounded-lg border border-slate-200 bg-white p-7">
                                <h2 className="text-[22px] font-bold">
                                    Informations complémentaires
                                </h2>

                                <div className="mt-5">
                                    <InfoRow
                                        label="Sigle"
                                        value={certification.sigle}
                                    />

                                    <InfoRow
                                        label="Métiers"
                                        value={getNames(certification.metiers)}
                                    />

                                    <InfoRow
                                        label="Établissements"
                                        value={getNames(
                                            certification.etablissements
                                        )}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Informations clés */}
                        <aside>
                            <div className="sticky top-[95px] rounded-lg border border-slate-200 bg-white p-6">

                                <h2 className="text-[18px] font-bold">
                                    Informations clés
                                </h2>

                                <div className="mt-5 divide-y">
                                    <InfoRow
                                        label="Niveau"
                                        value={niveau}
                                    />

                                    <InfoRow
                                        label="Durée"
                                        value={duree}
                                    />

                                    <InfoRow
                                        label="Modalité"
                                        value={modalite}
                                    />

                                    <InfoRow
                                        label="Organisme"
                                        value={organisme}
                                    />

                                    <InfoRow
                                        label="Statut"
                                        value={
                                            certification.statutVerification?.nom ||
                                            "Non renseigné"
                                        }
                                    />
                                </div>
                            </div>
                        </aside>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function InfoSection({ title, children }) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white p-7">
            <h2 className="text-[22px] font-bold">
                {title}
            </h2>

            <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                {children}
            </p>
        </section>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="border-b py-4 last:border-0">
            <p className="text-xs font-semibold uppercase text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm text-slate-700">
                {value || "Non renseigné"}
            </p>
        </div>
    );
}

function getNames(items) {
    return (
        items
            ?.map((item) => item.nom || item)
            .join(", ") || "Non renseigné"
    );
}
