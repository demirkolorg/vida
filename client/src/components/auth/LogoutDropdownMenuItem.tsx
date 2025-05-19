import { useAuthStore } from '@/stores/authStore';
import { DropdownMenuItem, DropdownMenuShortcut } from '../ui/dropdown-menu';
import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';

export const LogoutDropdownMenuItem = () => {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
      <LogOut />
      <p>Çıkış Yap</p>
      {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
    </DropdownMenuItem>
  );
};
