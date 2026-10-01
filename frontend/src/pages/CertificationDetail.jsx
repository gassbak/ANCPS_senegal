import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Badge from "../components/ui/Badge";
import { api } from "../services/api";
import jsPDF from "jspdf";

export default function CertificationDetail() {
    const { id } = useParams();

    const [certification, setCertification] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCertification() {
            try {
                setLoading(true);

                const data =
                    await api.getCertification(id);

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
const downloadPDF = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight =
        doc.internal.pageSize.getHeight();

    const margin = 20;

    let y = 20;

    // =========================
    // COULEURS
    // =========================

    const green = [6, 78, 59];
    const lightGreen = [236, 253, 245];
    const gray = [100, 116, 139];
    const dark = [15, 23, 42];
    const lightGray = [241, 245, 249];

    // =========================
    // FONCTIONS
    // =========================

    const addPageNumber = () => {
        doc.setFontSize(9);
        doc.setTextColor(...gray);

        doc.text(
            `ANCPS — Page ${doc.internal.getNumberOfPages()}`,
            pageWidth / 2,
            pageHeight - 10,
            {
                align: "center",
            }
        );
    };

    const checkPage = (height = 10) => {
        if (y + height > pageHeight - 25) {
            addPageNumber();

            doc.addPage();

            y = 20;
        }
    };

    const addSectionTitle = (title) => {
        checkPage(20);

        doc.setFillColor(...lightGreen);

        doc.roundedRect(
            margin,
            y,
            pageWidth - margin * 2,
            10,
            2,
            2,
            "F"
        );

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...green);

        doc.text(title, margin + 5, y + 7);

        y += 18;
    };

    const addParagraph = (text) => {
        if (!text) {
            text = "Non renseigné";
        }

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...dark);

        const lines =
            doc.splitTextToSize(
                String(text),
                pageWidth - margin * 2
            );

        lines.forEach((line) => {
            checkPage(7);

            doc.text(line, margin, y);

            y += 6;
        });

        y += 4;
    };

    const addInfo = (label, value) => {
        checkPage(12);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...gray);

        doc.text(label, margin, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...dark);

        const text =
            value || "Non renseigné";

        const lines =
            doc.splitTextToSize(
                String(text),
                110
            );

        doc.text(lines, margin + 55, y);

        y += Math.max(7, lines.length * 5);
    };

    // =========================
    // EN-TÊTE
    // =========================

    doc.setFillColor(...green);

    doc.rect(
        0,
        0,
        pageWidth,
        38,
        "F"
    );

    doc.setTextColor(255, 255, 255);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    doc.text(
        "ANCPS",
        margin,
        17
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
        "Annuaire des Certifications du Sénégal",
        margin,
        27
    );

    y = 52;

    // =========================
    // TITRE
    // =========================

    doc.setTextColor(...dark);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    doc.text(
        "FICHE DE CERTIFICATION",
        margin,
        y
    );

    y += 10;

    doc.setDrawColor(...green);

    doc.setLineWidth(1);

    doc.line(
        margin,
        y,
        pageWidth - margin,
        y
    );

    y += 12;

    // =========================
    // NOM CERTIFICATION
    // =========================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...green);

    const titleLines =
        doc.splitTextToSize(
            certification.title ||
                "Certification",
            pageWidth - margin * 2
        );

    titleLines.forEach((line) => {
        checkPage(9);

        doc.text(
            line,
            margin,
            y
        );

        y += 8;
    });

    y += 5;

    // =========================
    // INFORMATIONS
    // =========================

    addSectionTitle(
        "Informations générales"
    );

    addInfo(
        "Sigle",
        certification.sigle
    );

    addInfo(
        "Organisme",
        organisme
    );

    addInfo(
        "Domaine",
        certification.domaine?.nom ||
            certification.domaine ||
            certification.sector
    );

    addInfo(
        "Type",
        certification.type?.nom ||
            certification.nature?.nom ||
            "Certification"
    );

    addInfo(
        "Niveau",
        niveau
    );

    addInfo(
        "Durée",
        duree
    );

    addInfo(
        "Modalité",
        modalite
    );

    addInfo(
        "Statut",
        certification
            .statutVerification
            ?.nom
    );

    // =========================
    // DESCRIPTION
    // =========================

    addSectionTitle(
        "Présentation"
    );

    addParagraph(
        certification.description ||
            "Aucune description disponible."
    );

    // =========================
    // OBJECTIFS
    // =========================

    addSectionTitle(
        "Objectifs de la formation"
    );

    addParagraph(
        certification.objectifs ||
            "Les objectifs de cette certification ne sont pas encore renseignés."
    );

    // =========================
    // COMPÉTENCES
    // =========================

    addSectionTitle(
        "Blocs de compétences"
    );

    const competences =
        certification.competencesLibres ||
        [];

    if (competences.length === 0) {
        addParagraph(
            "Aucun bloc de compétences renseigné."
        );
    } else {
        competences.forEach(
            (competence) => {
                checkPage(10);

                doc.setFillColor(
                    ...lightGray
                );

                doc.roundedRect(
                    margin,
                    y - 5,
                    pageWidth -
                        margin * 2,
                    9,
                    1,
                    1,
                    "F"
                );

                doc.setFont(
                    "helvetica",
                    "normal"
                );

                doc.setFontSize(9);

                doc.setTextColor(
                    ...dark
                );

                const lines =
                    doc.splitTextToSize(
                        `• ${competence}`,
                        pageWidth -
                            margin * 2 -
                            8
                    );

                doc.text(
                    lines,
                    margin + 4,
                    y + 1
                );

                y +=
                    Math.max(
                        9,
                        lines.length * 5
                    ) + 3;
            }
        );
    }

    // =========================
    // MÉTIERS
    // =========================

    if (
        certification.metiers?.length
    ) {
        addSectionTitle(
            "Métiers associés"
        );

        const metiers =
            certification.metiers
                .map(
                    (item) =>
                        item.nom || item
                )
                .join(", ");

        addParagraph(metiers);
    }

    // =========================
    // ÉTABLISSEMENTS
    // =========================

    if (
        certification
            .etablissements?.length
    ) {
        addSectionTitle(
            "Établissements"
        );

        const etablissements =
            certification.etablissements
                .map(
                    (item) =>
                        item.nom || item
                )
                .join(", ");

        addParagraph(
            etablissements
        );
    }

    // =========================
    // PIED DE PAGE
    // =========================

    const totalPages =
        doc.internal.getNumberOfPages();

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {
        doc.setPage(i);

        doc.setDrawColor(
            226,
            232,
            240
        );

        doc.line(
            margin,
            pageHeight - 18,
            pageWidth - margin,
            pageHeight - 18
        );

        doc.setFontSize(8);

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setTextColor(...gray);

        doc.text(
            "Annuaire des Certifications du Sénégal — ANCPS",
            margin,
            pageHeight - 11
        );

        doc.text(
            `Page ${i} / ${totalPages}`,
            pageWidth - margin,
            pageHeight - 11,
            {
                align: "right",
            }
        );
    }

    // =========================
    // TÉLÉCHARGEMENT
    // =========================

    const filename =
        certification.title
            ? certification.title
                  .replace(
                      /[^a-z0-9]/gi,
                      "_"
                  )
                  .toLowerCase()
            : "certification";

    doc.save(
        `${filename}_ANCPS.pdf`
    );
};
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC]">
                <Navbar />

                <main className="px-6 pt-[130px]">
                    <div className="mx-auto max-w-[1220px]">
                        <p className="text-slate-500">
                            Chargement de la certification...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !certification) {
        return (
            <div className="min-h-screen bg-[#F8FAFC]">
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
                                className="
                                    mt-5
                                    inline-block
                                    font-semibold
                                    text-emerald-700
                                "
                            >
                                ← Retour à l'annuaire
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
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
                            className="
                                text-sm
                                font-medium
                                text-emerald-700
                            "
                        >
                            ← Retour à l'annuaire
                        </Link>

                        <div
                            className="
                                mt-7
                                flex
                                flex-wrap
                                gap-2
                            "
                        >
                            <Badge variant="green">
                                {certification.type?.nom ||
                                    certification.nature?.nom ||
                                    "Certification"}
                            </Badge>

                            <Badge variant="blue">
                                {niveau}
                            </Badge>
                        </div>

                        <h1
                            className="
                                mt-4
                                max-w-[850px]
                                text-[38px]
                                font-bold
                                leading-tight
                                tracking-[-0.8px]
                            "
                        >
                            {certification.title}
                        </h1>

                        <p
                            className="
                                mt-4
                                text-[16px]
                                text-slate-600
                            "
                        >
                            {organisme}
                        </p>

                        <p
                            className="
                                mt-1
                                text-[14px]
                                text-slate-500
                            "
                        >
                            Sénégal
                        </p>

                       <button
    type="button"
    onClick={downloadPDF}
    className="
        mt-6
        rounded-md
        bg-[#064E3B]
        px-5
        py-3
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-[#053c2e]
    "
>
    Télécharger la fiche PDF
</button>
                    </div>
                </section>

                {/* Contenu */}
                <section className="px-6 py-10">
                    <div
                        className="
                            mx-auto
                            grid
                            max-w-[1220px]
                            gap-8
                            lg:grid-cols-[1fr_320px]
                        "
                    >
                        {/* Colonne principale */}
                        <div className="space-y-7">
                            <section
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    p-7
                                "
                            >
                                <h2
                                    className="
                                        text-[22px]
                                        font-bold
                                    "
                                >
                                    Présentation
                                </h2>

                                <p
                                    className="
                                        mt-4
                                        whitespace-pre-line
                                        leading-7
                                        text-slate-600
                                    "
                                >
                                    {certification.description ||
                                        "Aucune description disponible."}
                                </p>
                            </section>

                            <section
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    p-7
                                "
                            >
                                <h2
                                    className="
                                        text-[22px]
                                        font-bold
                                    "
                                >
                                    Objectifs de la formation
                                </h2>

                                <p
                                    className="
                                        mt-4
                                        whitespace-pre-line
                                        leading-7
                                        text-slate-600
                                    "
                                >
                                    {certification.objectifs ||
                                        "Les objectifs de cette certification ne sont pas encore renseignés."}
                                </p>
                            </section>

                            <section
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    p-7
                                "
                            >
                                <h2
                                    className="
                                        text-[22px]
                                        font-bold
                                    "
                                >
                                    Blocs de compétences
                                </h2>

                                {certification.competencesLibres
                                    ?.length > 0 ? (
                                    <ul className="mt-4 space-y-3">
                                        {certification.competencesLibres.map(
                                            (
                                                competence,
                                                index
                                            ) => (
                                                <li
                                                    key={
                                                        index
                                                    }
                                                    className="
                                                        rounded-md
                                                        bg-slate-50
                                                        px-4
                                                        py-3
                                                        text-slate-600
                                                    "
                                                >
                                                    {competence}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p
                                        className="
                                            mt-4
                                            text-slate-500
                                        "
                                    >
                                        Aucun bloc de
                                        compétences
                                        renseigné.
                                    </p>
                                )}
                            </section>

                            <section
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    p-7
                                "
                            >
                                <h2
                                    className="
                                        text-[22px]
                                        font-bold
                                    "
                                >
                                    Informations complémentaires
                                </h2>

                                <div className="mt-5 space-y-4">
                                    <InfoRow
                                        label="Sigle"
                                        value={
                                            certification.sigle
                                        }
                                    />

                                    <InfoRow
                                        label="Métiers"
                                        value={
                                            certification
                                                .metiers
                                                ?.map(
                                                    (item) =>
                                                        item.nom ||
                                                        item
                                                )
                                                .join(", ")
                                        }
                                    />

                                    <InfoRow
                                        label="Établissements"
                                        value={
                                            certification
                                                .etablissements
                                                ?.map(
                                                    (item) =>
                                                        item.nom ||
                                                        item
                                                )
                                                .join(", ")
                                        }
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Informations clés */}
                        <aside>
                            <div
                                className="
                                    sticky
                                    top-[95px]
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                "
                            >
                                <h2
                                    className="
                                        text-[18px]
                                        font-bold
                                    "
                                >
                                    Informations clés
                                </h2>

                                <div
                                    className="
                                        mt-5
                                        divide-y
                                    "
                                >
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
                                            certification
                                                .statutVerification
                                                ?.nom ||
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

function InfoRow({ label, value }) {
    return (
        <div className="py-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm text-slate-700">
                {value || "Non renseigné"}
            </p>
        </div>
    );
}