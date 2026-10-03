import { useState } from "react";
import {
    Link,
    useSearchParams,
} from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Badge from "../components/ui/Badge";
import useCertifications from "../hooks/useCertifications";


function SearchIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
        >
            <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
            />

            <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}


function BuildingIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M5 21V4C5 3.45 5.45 3 6 3H18C18.55 3 19 3.45 19 4V21"
                stroke="currentColor"
                strokeWidth="1.6"
            />

            <path
                d="M8 7H10M14 7H16M8 11H10M14 11H16M8 15H10M14 15H16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />

            <path
                d="M3 21H21"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}


function ArrowRight() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M13 6L19 12L13 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}


export default function Annuaire() {

    const [search, setSearch] = useState("");

    const [selectedDomains, setSelectedDomains] = useState([]);

    const [selectedLevels, setSelectedLevels] = useState([]);

    const [searchParams] = useSearchParams();


    const domaineFromUrl =
        searchParams.get("domaine");


    const {
        certifications,
        loading,
    } = useCertifications(search);


    /*
     * DOMAINES
     */

    const domains = [
        ...new Set(
            certifications
                .map(
                    (certification) =>
                        certification.sector
                )
                .filter(Boolean)
        ),
    ];


    /*
     * NIVEAUX
     */

    const levels = [
        ...new Set(
            certifications
                .map(
                    (certification) =>
                        certification.niveau
                )
                .filter(Boolean)
        ),
    ];


    /*
     * FILTRE DOMAINE
     */

    const toggleDomain = (domain) => {

        setSelectedDomains((current) => {

            if (current.includes(domain)) {

                return current.filter(
                    (item) => item !== domain
                );

            }

            return [
                ...current,
                domain,
            ];

        });

    };


    /*
     * FILTRE NIVEAU
     */

    const toggleLevel = (level) => {

        setSelectedLevels((current) => {

            if (current.includes(level)) {

                return current.filter(
                    (item) => item !== level
                );

            }

            return [
                ...current,
                level,
            ];

        });

    };


    /*
     * FILTRAGE
     */

    const filteredCertifications =
        certifications.filter(
            (certification) => {

                const domainOk =
                    domaineFromUrl
                        ? certification.sector ===
                          domaineFromUrl
                        : selectedDomains.length === 0 ||
                          selectedDomains.includes(
                              certification.sector
                          );


                const levelOk =
                    selectedLevels.length === 0 ||
                    selectedLevels.includes(
                        certification.niveau
                    );


                return (
                    domainOk &&
                    levelOk
                );

            }
        );


    return (

        <div
            className="
                min-h-screen
                bg-[#F8FAFC]
                text-[#0F172A]
            "
        >

            <Navbar />


            {/* =========================================
                CONTENU PRINCIPAL
            ========================================= */}

            <main className="pt-[74px]">


                {/* =========================================
                    TITRE
                ========================================= */}

                <section
                    className="
                        px-4
                        py-10
                        sm:px-6
                        sm:py-12
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-[1220px]
                        "
                    >

                        <div className="max-w-[700px]">

                            <p
                                className="
                                    mb-3
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-emerald-600
                                "
                            >
                                Annuaire ANCPS
                            </p>


                            <h1
                                className="
                                    text-[32px]
                                    font-bold
                                    leading-tight
                                    tracking-[-0.8px]
                                    text-slate-900
                                    sm:text-[38px]
                                "
                            >
                                Annuaire des
                                Certifications
                            </h1>


                            <p
                                className="
                                    mt-3
                                    text-[16px]
                                    leading-7
                                    text-slate-500
                                    sm:text-[17px]
                                "
                            >
                                Explorez les formations,
                                certifications et
                                qualifications
                                disponibles au Sénégal.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    ANNuaire
                ========================================= */}

                <section
                    className="
                        px-4
                        pb-16
                        sm:px-6
                        sm:pb-[70px]
                    "
                >

                    <div
                        className="
                            mx-auto
                            grid
                            max-w-[1220px]
                            gap-6
                            lg:grid-cols-[260px_1fr]
                            xl:grid-cols-[270px_1fr]
                        "
                    >


                        {/* =================================
                            FILTRES
                        ================================= */}

                        <aside
                            className="
                                h-fit
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-[0_2px_10px_rgba(15,23,42,0.04)]
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <h2
                                    className="
                                        text-[18px]
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Filtres
                                </h2>


                                {(selectedDomains.length >
                                    0 ||
                                    selectedLevels.length >
                                        0) && (

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedDomains(
                                                []
                                            );

                                            setSelectedLevels(
                                                []
                                            );
                                        }}
                                        className="
                                            text-xs
                                            font-medium
                                            text-emerald-600
                                            hover:text-emerald-700
                                        "
                                    >
                                        Réinitialiser
                                    </button>

                                )}

                            </div>


                            <div
                                className="
                                    my-5
                                    border-t
                                    border-slate-100
                                "
                            />


                            {/* DOMAINES */}

                            <h3
                                className="
                                    text-[14px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Domaines
                            </h3>


                            <div className="mt-4 space-y-3">

                                {domains.length === 0 && (

                                    <p
                                        className="
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        Aucun domaine
                                        disponible.
                                    </p>

                                )}


                                {domains.map(
                                    (domain) => (

                                        <label
                                            key={domain}
                                            className="
                                                flex
                                                cursor-pointer
                                                items-start
                                                gap-3
                                                text-[14px]
                                                text-slate-600
                                            "
                                        >

                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedDomains.includes(
                                                        domain
                                                    )
                                                }
                                                onChange={() =>
                                                    toggleDomain(
                                                        domain
                                                    )
                                                }
                                                className="
                                                    mt-0.5
                                                    h-4
                                                    w-4
                                                    accent-emerald-600
                                                "
                                            />

                                            <span
                                                className="
                                                    leading-5
                                                "
                                            >
                                                {domain}
                                            </span>

                                        </label>

                                    )
                                )}

                            </div>


                            <div
                                className="
                                    my-6
                                    border-t
                                    border-slate-100
                                "
                            />


                            {/* NIVEAUX */}

                            <h3
                                className="
                                    text-[14px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Niveau
                            </h3>


                            <div className="mt-4 space-y-3">

                                {levels.length === 0 && (

                                    <p
                                        className="
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        Aucun niveau
                                        disponible.
                                    </p>

                                )}


                                {levels.map(
                                    (level) => (

                                        <label
                                            key={level}
                                            className="
                                                flex
                                                cursor-pointer
                                                items-start
                                                gap-3
                                                text-[14px]
                                                text-slate-600
                                            "
                                        >

                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedLevels.includes(
                                                        level
                                                    )
                                                }
                                                onChange={() =>
                                                    toggleLevel(
                                                        level
                                                    )
                                                }
                                                className="
                                                    mt-0.5
                                                    h-4
                                                    w-4
                                                    accent-emerald-600
                                                "
                                            />

                                            <span
                                                className="
                                                    leading-5
                                                "
                                            >
                                                {level}
                                            </span>

                                        </label>

                                    )
                                )}

                            </div>

                        </aside>


                        {/* =================================
                            RÉSULTATS
                        ================================= */}

                        <section>


                            {/* =================================
                                RECHERCHE
                            ================================= */}

                            <div
                                className="
                                    flex
                                    w-full
                                    items-center
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-2
                                    shadow-[0_2px_10px_rgba(15,23,42,0.04)]
                                    transition
                                    focus-within:border-emerald-500
                                    focus-within:ring-4
                                    focus-within:ring-emerald-500/10
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        text-slate-400
                                    "
                                >
                                    <SearchIcon />
                                </div>


                                <input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="
                                        Rechercher une certification,
                                        un métier, une compétence...
                                    "
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        px-3
                                        py-4
                                        text-[15px]
                                        text-slate-800
                                        outline-none
                                        placeholder:text-slate-400
                                    "
                                />


                                {search && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        className="
                                            mr-2
                                            shrink-0
                                            rounded-lg
                                            px-3
                                            py-2
                                            text-xs
                                            font-medium
                                            text-slate-500
                                            transition
                                            hover:bg-slate-100
                                            hover:text-slate-700
                                        "
                                    >
                                        Effacer
                                    </button>

                                )}

                            </div>


                            {/* =================================
                                NOMBRE
                            ================================= */}

                            <div
                                className="
                                    mb-5
                                    mt-6
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    <span
                                        className="
                                            font-semibold
                                            text-slate-900
                                        "
                                    >
                                        {
                                            filteredCertifications.length
                                        }
                                    </span>

                                    {" "}

                                    certification
                                    {filteredCertifications.length >
                                    1
                                        ? "s"
                                        : ""}

                                </p>


                                <span
                                    className="
                                        hidden
                                        text-xs
                                        text-slate-400
                                        sm:block
                                    "
                                >
                                    Résultats de l'annuaire
                                </span>

                            </div>


                            {/* =================================
                                CHARGEMENT
                            ================================= */}

                            {loading && (

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-10
                                        text-center
                                        text-slate-500
                                        shadow-sm
                                    "
                                >
                                    Chargement des
                                    certifications...
                                </div>

                            )}


                            {/* =================================
                                CARTES
                            ================================= */}

                            {!loading && (

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-5
                                        sm:grid-cols-2
                                        xl:grid-cols-3
                                    "
                                >

                                    {filteredCertifications.map(
                                        (certification) => (

                                            <CertificationCard
                                                key={
                                                    certification.id
                                                }
                                                certification={
                                                    certification
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            )}


                            {/* =================================
                                AUCUN RÉSULTAT
                            ================================= */}

                            {!loading &&
                                filteredCertifications.length ===
                                    0 && (

                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-10
                                            text-center
                                            shadow-sm
                                        "
                                    >

                                        <div
                                            className="
                                                mx-auto
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-slate-100
                                                text-slate-400
                                            "
                                        >
                                            <SearchIcon />
                                        </div>


                                        <p
                                            className="
                                                mt-4
                                                font-semibold
                                                text-slate-900
                                            "
                                        >
                                            Aucune certification
                                            trouvée.
                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                text-slate-500
                                            "
                                        >
                                            Essayez une autre
                                            recherche ou un autre
                                            filtre.
                                        </p>


                                        {search && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSearch("")
                                                }
                                                className="
                                                    mt-5
                                                    rounded-lg
                                                    bg-emerald-600
                                                    px-4
                                                    py-2
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    transition
                                                    hover:bg-emerald-700
                                                "
                                            >
                                                Effacer la recherche
                                            </button>

                                        )}

                                    </div>

                                )}

                        </section>

                    </div>

                </section>

            </main>


            <Footer />

        </div>
    );
}


/* =====================================================
   CARTE CERTIFICATION
===================================================== */

function CertificationCard({
    certification,
}) {

    return (

        <article
            className="
                group
                flex
                h-full
                min-h-[310px]
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-[0_2px_8px_rgba(15,23,42,0.05)]
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-emerald-200
                hover:shadow-[0_12px_30px_rgba(15,23,42,0.10)]
            "
        >


            {/* =========================================
                CONTENU
            ========================================= */}

            <div
                className="
                    flex
                    flex-1
                    flex-col
                    p-6
                "
            >


                {/* BADGES */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    <Badge
                        variant={
                            certification.type ===
                            "Licence"
                                ? "green"
                                : "blue"
                        }
                    >
                        {certification.type ||
                            "Certification"}
                    </Badge>


                    {certification.mode && (

                        <span
                            className="
                                rounded-full
                                bg-slate-100
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-slate-600
                            "
                        >
                            {certification.mode}
                        </span>

                    )}

                </div>


                {/* TITRE */}

                <h2
                    className="
                        mt-5
                        line-clamp-2
                        min-h-[52px]
                        text-[19px]
                        font-bold
                        leading-[26px]
                        tracking-[-0.2px]
                        text-slate-900
                        transition-colors
                        group-hover:text-emerald-700
                    "
                >
                    {certification.title}
                </h2>


                {/* ORGANISME */}

                <div
                    className="
                        mt-4
                        flex
                        items-start
                        gap-2
                        text-[13px]
                        text-slate-500
                    "
                >

                    <div
                        className="
                            mt-0.5
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-emerald-50
                            text-emerald-600
                        "
                    >
                        <BuildingIcon />
                    </div>


                    <div className="min-w-0">

                        <p
                            className="
                                text-[11px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-slate-400
                            "
                        >
                            Organisme certificateur
                        </p>


                        <p
                            className="
                                mt-0.5
                                line-clamp-1
                                font-medium
                                text-slate-700
                            "
                        >
                            {certification.organization ||
                                "Organisme non renseigné"}
                        </p>

                    </div>

                </div>


                {/* DESCRIPTION */}

                <p
                    className="
                        mt-5
                        line-clamp-3
                        text-[14px]
                        leading-[22px]
                        text-slate-500
                    "
                >
                    {certification.description ||
                        "Aucune description disponible pour cette certification."}
                </p>


                {/* ESPACE */}

                <div className="flex-1" />

            </div>


            {/* =========================================
                FOOTER DE LA CARTE
            ========================================= */}

            <div
                className="
                    flex
                    min-h-[65px]
                    items-center
                    justify-between
                    gap-3
                    border-t
                    border-slate-100
                    bg-slate-50/80
                    px-6
                "
            >


                {/* DOMAINE */}

                <span
                    className="
                        max-w-[55%]
                        truncate
                        rounded-full
                        bg-white
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-slate-600
                        ring-1
                        ring-slate-200
                    "
                    title={
                        certification.sector
                    }
                >
                    {certification.sector ||
                        "Domaine non renseigné"}
                </span>


                {/* DETAILS */}

                <Link
                    to={
                        `/certification/${certification.id}`
                    }
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-lg
                        px-3
                        py-2
                        text-[13px]
                        font-semibold
                        text-emerald-700
                        transition
                        hover:bg-emerald-50
                    "
                >

                    Voir les détails

                    <span
                        className="
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                        "
                    >
                        <ArrowRight />
                    </span>

                </Link>

            </div>

        </article>

    );
}