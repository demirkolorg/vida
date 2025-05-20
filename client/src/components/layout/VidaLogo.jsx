import { Package2 } from "lucide-react";
import { Link } from "react-router-dom";
import vdalogo from "@/assets/vidalogo.svg";
export const VidaLogo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 text-lg font-semibold md:text-base"
    >
        { <img src={vdalogo} alt="Logo" className="h-10 w-10" /> }
      {/* <Package2 className="h-6 w-6" /> */}
      <span className="">Vida</span>
    </Link>
  );
};
