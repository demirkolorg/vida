import { Link } from 'react-router-dom';
import vdalogo from '@/assets/vidalogo.svg';
import { Badge } from '@/components/ui/badge';
export const VidaLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2  font-semibold md:text-base">
      {<img src={vdalogo} alt="Logo" className="h-10 w-10" />}
      <h1 className="font-poppins text-2xl font-bold text-primary  ">vida</h1>
      <Badge variant="outline" className="w-5 h-5 mb-4 -ml-2 bg-primary/10" >v2</Badge>
    </Link>
  );
};
