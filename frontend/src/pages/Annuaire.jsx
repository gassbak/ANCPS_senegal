import { useEffect, useState } from "react";
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

const domains = [
    ...new Set(
        certifications
            .map((certification) => certification.sector)
            .filter(Boolean)
    ),
];

const levels = [
    ...new Set(
        certifications
            .map((certification) => certification.niveau)
            .filter(Boolean)
    ),
];
    const toggleDomain = (domain) => {

        setSelectedDomains((current) => {

            if (current.includes(domain)) {
                return current.filter(
                    (item) => item !== domain
                );
            }

            return [...current, domain];
        });
    };


    const toggleLevel = (level) => {

        setSelectedLevels((current) => {

            if (current.includes(level)) {
                return current.filter(
                    (item) => item !== level
                );
            }

            return [...current, level];
        });
    };


    const filteredCertifications =
    certifications.filter((certification) => {

        const domainOk =
            domaineFromUrl
                ? certification.sector === domaineFromUrl
                : selectedDomains.length === 0 ||
                  selectedDomains.includes(
                      certification.sector
                  );

        const levelOk =
            selectedLevels.length === 0 ||
            selectedLevels.includes(
                certification.niveau
            );

        return domainOk && levelOk;
    });


    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">

            {/* NAVBAR EXISTANT */}

            <Navbar />


            {/* CONTENU */}

            <main className="pt-[74px]">

                {/* TITRE */}

                <section className="px-6 py-[48px]">

                    <div className="mx-auto max-w-[1220px]">

                        <h1
                            className="
                                text-[38px]
                                font-bold
                                tracking-[-0.8px]
                            "
                        >
                            Annuaire des Certifications
                        </h1>

                        <p
                            className="
                                mt-3
                                text-[17px]
                                text-slate-500
                            "
                        >
                            Explorez les formations et
                            certifications accréditées.
                        </p>

                    </div>

                </section>


                {/* ANNuaire */}

                <section className="px-6 pb-[70px]">

                    <div
                        className="
                            mx-auto
                            max-w-[1220px]
                            grid
                            gap-[30px]
                            lg:grid-cols-[270px_1fr]
                        "
                    >

                        {/* FILTRES */}

                        <aside
                            className="
                                h-fit
                                rounded-[8px]
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-[0_1px_4px_rgba(0,0,0,0.05)]
                            "
                        >

                            <h2 className="text-[18px] font-bold">
                                Filtres
                            </h2>


                            <div className="my-5 border-t" />


                            <h3 className="text-[15px] font-bold">
                                Domaines
                            </h3>


                            <div className="mt-4 space-y-3">

                                {domains.map((domain) => (

                                    <label
                                        key={domain}
                                        className="
                                            flex
                                            cursor-pointer
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
                                            className="mt-0.5"
                                        />

                                        <span>
                                            {domain}
                                        </span>

                                    </label>

                                ))}

                            </div>


                            <div className="my-6 border-t" />


                            <h3 className="text-[15px] font-bold">
                                Niveau
                            </h3>


                            <div className="mt-4 space-y-3">

                                {levels.map((level) => (

                                    <label
                                        key={level}
                                        className="
                                            flex
                                            cursor-pointer
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
                                            className="mt-0.5"
                                        />

                                        <span>
                                            {level}
                                        </span>

                                    </label>

                                ))}

                            </div>

                        </aside>


                        {/* RÉSULTATS */}

                        <section>

                            {/* RECHERCHE */}

                            <div
                                className="
                                    flex
                                    w-full
                                    rounded-[8px]
                                    border
                                    border-slate-200
                                    bg-white
                                    p-2
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        pl-3
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
                                        Mots-clés, métier,
                                        compétence...
                                    "
                                    className="
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        px-4
                                        py-3
                                        text-[15px]
                                        outline-none
                                    "
                                />

                            </div>


                            {/* NOMBRE */}

                            <div
                                className="
                                    mb-5
                                    mt-5
                                    text-[14px]
                                    text-slate-500
                                "
                            >
                                {filteredCertifications.length}
                                {" "}
                                certification(s)
                            </div>


                            {/* CHARGEMENT */}

                            {loading && (

                                <div
                                    className="
                                        rounded-[8px]
                                        bg-white
                                        p-10
                                        text-center
                                        text-slate-500
                                    "
                                >
                                    Chargement des
                                    certifications...
                                </div>

                            )}


                            {/* CARTES */}

                            {!loading && (

                                <div
                                    className="
                                        grid
                                        gap-[24px]
                                        md:grid-cols-2
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


                            {/* AUCUN RÉSULTAT */}

                            {!loading &&
                                filteredCertifications.length ===
                                    0 && (

                                    <div
                                        className="
                                            rounded-[8px]
                                            border
                                            bg-white
                                            p-10
                                            text-center
                                        "
                                    >
                                        <p className="font-semibold">
                                            Aucune certification
                                            trouvée.
                                        </p>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Essayez une autre
                                            recherche ou un autre
                                            filtre.
                                        </p>

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


function CertificationCard({ certification }) {

    return (
        <article
            className="
                flex
                min-h-[262px]
                flex-col
                overflow-hidden
                rounded-[8px]
                border
                border-slate-200
                bg-white
                shadow-[0_1px_4px_rgba(0,0,0,0.07)]
            "
        >

            <div className="flex-1 px-5 pt-5">

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
                            certification.type === "Licence"
                                ? "green"
                                : "blue"
                        }
                    >
                        {certification.type}
                    </Badge>

                    <span
                        className="
                            text-[13px]
                            text-slate-500
                        "
                    >
                        {certification.mode}
                    </span>

                </div>


                <h2
                    className="
                        mt-3
                        text-[19px]
                        font-bold
                        leading-[24px]
                    "
                >
                    {certification.title}
                </h2>


                <p
                    className="
                        mt-2
                        flex
                        items-center
                        gap-1
                        text-[14px]
                        text-slate-600
                    "
                >
                    <BuildingIcon />

                    {certification.organization ||
                        "Organisme non renseigné"}
                </p>


                <p
                    className="
                        mt-4
                        text-[15px]
                        leading-[22px]
                        text-slate-500
                    "
                >
                    {certification.description ||
                        "Aucune description disponible."}
                </p>

            </div>


            <div
                className="
                    flex
                    min-h-[51px]
                    items-center
                    justify-between
                    border-t
                    border-slate-100
                    bg-[#F8FAFC]
                    px-5
                "
            >

                <span
                    className="
                        max-w-[65%]
                        rounded-[4px]
                        bg-slate-200
                        px-2.5
                        py-1
                        text-[12px]
                        text-slate-600
                    "
                >
                    {certification.sector ||
                        "Domaine"}
                </span>


                <Link
                    to={
                        `/certification/${certification.id}`
                    }
                    className="
                        flex
                        items-center
                        gap-1
                        text-[14px]
                        font-semibold
                        text-emerald-700
                    "
                >
                    Détails
                    <ArrowRight />
                </Link>

            </div>

        </article>
    );
}