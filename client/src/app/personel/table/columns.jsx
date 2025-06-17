import { HeaderButton } from '@/components/table/HeaderButton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EntityHuman } from '../constants/api';

export const Personel_Columns = () => {
  const inArrayFilterFn = (row, columnId, filterValueArray) => {
    if (!filterValueArray || filterValueArray.length === 0) {
      return true;
    }
    const rowValue = row.getValue(columnId);
    return filterValueArray.includes(rowValue);
  };

  return [
    {
      accessorKey: 'avatar',
      header: ({ column }) => <HeaderButton column={column} title="Avatar" />,
      cell: ({ row }) => {
        const personel = row.original;
        return (
          <Avatar className="h-8 w-8">
            <AvatarImage src={personel.avatar || '/placeholder.png'} alt={personel.ad || 'Avatar'} />
            <AvatarFallback className="text-xs">{personel.ad?.substring(0, 1) || 'P'}</AvatarFallback>
          </Avatar>
        );
      },
      enableSorting: false,
      size: 80,
      meta: {
        exportHeader: 'Avatar',
        filterVariant: 'none',
      },
    },
    {
      accessorKey: 'ad',
      header: ({ column }) => <HeaderButton column={column} title={`${EntityHuman} Adı`} />,
      cell: ({ row }) => {
        const ad = row.getValue('ad');
        return <div className="font-medium">{ad || '-'}</div>;
      },
      enableHiding: false,
      size: 200,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: `${EntityHuman} Adı`,
        filterVariant: 'text',
      },
    }, {
      accessorKey: 'soyad',
      header: ({ column }) => <HeaderButton column={column} title={`${EntityHuman} Soyadı`} />,
      cell: ({ row }) => {
        const soyad = row.getValue('soyad');
        return <div className="font-medium">{soyad || '-'}</div>;
      },
      enableHiding: false,
      size: 200,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: `${EntityHuman} Soyadı`,
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'sicil',
      header: ({ column }) => <HeaderButton column={column} title="Sicil No" />,
      cell: ({ row }) => {
        const sicil = row.getValue('sicil');
        return (
          <Badge variant="outline" className="font-mono text-xs">
            {sicil || '-'}
          </Badge>
        );
      },
      size: 120,
      filterFn: inArrayFilterFn,
      meta: {
        exportHeader: 'Sicil No',
        filterVariant: 'text',
      },
    },
    // YENİ: Malzeme Sayısı Kolonu
    {
      accessorKey: 'malzemeSayisi',
      accessorFn: row => row.malzemeSayisi || 0,
      header: ({ column }) => <HeaderButton column={column} title="Malzeme Sayısı" />,
      cell: ({ row }) => {
        const malzemeSayisi = row.original.malzemeSayisi || 0;
        const demirbasSayisi = row.original.demirbasSayisi || 0;
        const sarfSayisi = row.original.sarfSayisi || 0;
        
        return (
          <div className="flex flex-col items-center space-y-1">
            <Badge 
              variant={malzemeSayisi > 0 ? "default" : "outline"} 
              className="text-xs font-semibold"
            >
              {malzemeSayisi}
            </Badge>
            {malzemeSayisi > 0 && (
              <div className="text-xs text-muted-foreground">
                D:{demirbasSayisi} S:{sarfSayisi}
              </div>
            )}
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.malzemeSayisi || 0;
        const b = rowB.original.malzemeSayisi || 0;
        return a - b;
      },
      size: 100,
      meta: {
        exportHeader: 'Malzeme Sayısı',
        filterVariant: 'none',
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <HeaderButton column={column} title="Rol" />,
      cell: ({ row }) => {
        const role = row.getValue('role');
        const roleColors = {
          'Superadmin': 'destructive',
          'Admin': 'warning_muted',
          'Personel': 'secondary',
          'User': 'outline'
        };
        return (
          <Badge variant={roleColors[role] || 'outline'} className="text-xs">
            {role || '-'}
          </Badge>
        );
      },
      filterFn: inArrayFilterFn,
      size: 120,
      meta: {
        exportHeader: 'Rol',
        filterVariant: 'select',
        filterOptions: [
          { label: 'Superadmin', value: 'Superadmin' },
          { label: 'Admin', value: 'Admin' },
          { label: 'Personel', value: 'Personel' },
          { label: 'User', value: 'User' },
        ],
      },
    },
    {
      accessorKey: 'buro',
      accessorFn: row => row.buro?.ad || '',
      header: ({ column }) => <HeaderButton column={column} title="Bağlı Büro" />,
      cell: ({ row }) => {
        const buro = row.original.buro;
        if (!buro) {
          return <div className="text-sm text-gray-500">-</div>;
        }
        
        return (
          <div className="flex flex-col space-y-1">
            <Badge variant="outline" className="text-xs">
              {buro.ad}
            </Badge>
            {buro.sube && (
              <span className="text-xs text-muted-foreground">
                {buro.sube.ad}
              </span>
            )}
          </div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 180,
      meta: {
        exportHeader: 'Bağlı Büro',
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'isUser',
      header: ({ column }) => <HeaderButton column={column} title="Sistem Kullanıcısı" />,
      cell: ({ row }) => {
        const isUser = row.getValue('isUser');
        return (
          <Badge variant={isUser ? 'success_muted' : 'outline'} className="text-xs">
            {isUser ? 'Evet' : 'Hayır'}
          </Badge>
        );
      },
      filterFn: inArrayFilterFn,
      size: 140,
      meta: {
        exportHeader: 'Sistem Kullanıcısı',
        filterVariant: 'select',
        filterOptions: [
          { label: 'Evet', value: true },
          { label: 'Hayır', value: false },
        ],
      },
    },
    {
      accessorKey: 'isAmir',
      header: ({ column }) => <HeaderButton column={column} title="Amir" />,
      cell: ({ row }) => {
        const isAmir = row.getValue('isAmir');
        return (
          <Badge variant={isAmir ? 'warning_muted' : 'outline'} className="text-xs">
            {isAmir ? 'Evet' : 'Hayır'}
          </Badge>
        );
      },
      filterFn: inArrayFilterFn,
      size: 100,
      meta: {
        exportHeader: 'Amir',
        filterVariant: 'select',
        filterOptions: [
          { label: 'Evet', value: true },
          { label: 'Hayır', value: false },
        ],
      },
    },
    {
      accessorKey: 'lastLogin',
      accessorFn: row => row.lastLogin ? new Date(row.lastLogin).toLocaleDateString('tr-TR') : '',
      header: ({ column }) => <HeaderButton column={column} title="Son Giriş" />,
      cell: ({ row }) => {
        const lastLogin = row.original.lastLogin;
        if (!lastLogin) {
          return <div className="text-sm text-gray-500">-</div>;
        }
        
        const date = new Date(lastLogin);
        const isRecent = (Date.now() - date.getTime()) < (7 * 24 * 60 * 60 * 1000); // Son 7 gün
        
        return (
          <div className="text-xs">
            <div className={isRecent ? 'text-green-600' : 'text-muted-foreground'}>
              {date.toLocaleDateString('tr-TR')}
            </div>
            <div className="text-muted-foreground">
              {date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      },
      filterFn: inArrayFilterFn,
      size: 120,
      meta: {
        exportHeader: 'Son Giriş',
        filterVariant: 'date',
      },
    },
  ];
};