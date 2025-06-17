import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LifeBuoy } from 'lucide-react';
import { IoMdHelp } from "react-icons/io";

export const RehberButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/rehber'); // "/about" sayfasına yönlendirir
  };
  return (
    <Button variant="outline" size="icon" onClick={handleClick} className="h-8 w-8">
      <IoMdHelp />
    </Button>
  );
};
