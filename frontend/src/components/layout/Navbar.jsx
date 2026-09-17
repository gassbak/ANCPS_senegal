import { Link } from "react-router-dom";

function LogoIcon() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10">
      <svg
        width="23"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4.5C4 3.67 4.67 3 5.5 3H18.5C19.33 3 20 3.67 20 4.5V19.5C20 20.33 19.33 21 18.5 21H5.5C4.67 21 4 20.33 4 19.5V4.5Z"
          stroke="white"
          strokeWidth="1.7"
        />
        <path
          d="M8 7H16M8 11H16M8 
          
          15H13"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function Navbar() {
  return (
   <header className="relative z-50 h-[74px] bg-[#064E3B] text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
      <div className="mx-auto flex h-full max-w-[1220px] items-center px-8">

        {/* LOGO */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5"
        >
          <LogoIcon />

          <span className="text-[20px] font-bold tracking-[-0.3px]">
            ANCPS
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="ml-[68px] flex items-center gap-[38px]">
          <Link
            to="/"
            className="text-[15px] font-semibold transition hover:text-yellow-300"
          >
            Accueil
          </Link>

          <Link
            to="/"
            className="text-[15px] font-semibold transition hover:text-yellow-300"
          >
            L'Annuaire
          </Link>

        <Link
  to="/about"
  className="text-[15px] font-semibold transition hover:text-yellow-300"
>
  À propos
</Link>
        </nav>

        {/* ESPACE PRO */}
        <Link
          to="/login"
          className="ml-auto rounded-[7px] bg-[#FBBF00] px-[18px] py-[9px] text-[14px] font-bold text-[#073B2D] transition hover:bg-[#F5B900]"
        >
          Espace Pro
        </Link>
      </div>
    </header>
  );
}