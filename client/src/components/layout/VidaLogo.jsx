import { Link } from "react-router-dom";
import vdalogo from "@/assets/vidalogo.svg";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { currentDb } from "../../api/database";
import { Server } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export const VidaLogo = () => {
  const [dbName, setDbbName] = useState("");
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const dbname = currentDb();
    setDbbName(dbname);
  }, []);

  return (
    <>
      <Link
        to="/"
        className="flex items-center gap-2  font-semibold md:text-base"
      >
        {<img src={vdalogo} alt="Logo" className="h-10 w-10" />}
        <h1 className="font-poppins text-2xl font-bold text-primary  ">vida</h1>
        <Badge variant="outline" className="w-5 h-5 mb-4 -ml-2 bg-primary/10">
          v2
        </Badge>
      </Link>

      {user.role === "Superadmin" && (
        <Badge variant="outline" className="relative rounded-md h-6 ml-2">
          <Server />
          db: {dbName}
        </Badge>
      )}
    </>
  );
};
