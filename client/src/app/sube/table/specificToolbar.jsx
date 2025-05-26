import { Building2Icon, PackageIcon, TreePine } from "lucide-react";

// Örnek gelişmiş toolbar
export const Sube_SpecificToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Birim bazında filtreleme */}
      {/* <BirimFilterDropdown /> */}
      
      {/* Büro sayısına göre sıralama */}
      <Button variant="outline" size="sm">
        <Building2Icon className="mr-2 h-4 w-4" />
        Büro Sayısına Göre
      </Button>
      
      {/* Malzeme dağılım raporu */}
      <Button variant="outline" size="sm">
        <PackageIcon className="mr-2 h-4 w-4" />
        Malzeme Raporu
      </Button>
      
      {/* Şube hiyerarşi görünümü */}
      <Button variant="outline" size="sm">
        <TreePine className="mr-2 h-4 w-4" />
        Hiyerarşi Görünümü
      </Button>
    </div>
  );
};