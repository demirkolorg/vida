import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge'; // Badge bileşeninin yolu doğru varsayıldı
import { HeaderButton } from '@/components/table/HeaderButton';
// import { EntityHuman } from '../constants/api'; // AuditLog sütun başlıkları genellikle EntityHuman'a ihtiyaç duymaz,
// ancak projenizin tutarlılığı için tutulabilir.

// Opsiyonel: Seviye (Level) için Badge varyantlarını belirleyen yardımcı fonksiyon
const getLevelBadgeVariant = level => {
  if (!level) return 'outline';
  const lowerLevel = level.toLowerCase();
  if (lowerLevel === 'error' || lowerLevel === 'err') return 'destructive';
  if (lowerLevel === 'warn' || lowerLevel === 'warning') return 'warning';
  if (lowerLevel === 'info') return 'info_muted'; // Shadcn UI'da info_muted olmayabilir, 'info' veya özel bir stil kullanın
  if (lowerLevel === 'debug' || lowerLevel === 'dbg') return 'secondary';
  return 'outline';
};

export const Audit_Columns = () => [
  {
    accessorKey: 'id',
    header: ({ column }) => <HeaderButton column={column} title="Log ID" />,
    cell: ({ row }) => {
      const id = row.getValue('id');
      return <div className="font-mono text-xs  text-muted-foreground">{id || '-'}</div>;
    },
    size: 150,
    minSize: 120,
    enableHiding: true, // ID'ler genellikle detaylarda daha önemlidir, tabloda gizlenebilir
    enableSorting: true,
    meta: {
      exportHeader: 'Log ID',
      filterVariant: 'text',
    },
  },

  {
    accessorKey: 'hizmet',
    header: ({ column }) => <HeaderButton column={column} title="Hizmet" />,
    cell: ({ row }) => {
      const hizmet = row.getValue('hizmet');
      return <div className="text-sm truncate max-w-xs">{hizmet || '-'}</div>;
    },
    size: 180,
    minSize: 120,
    enableSorting: true,
    meta: {
      exportHeader: 'Hizmet',
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'rota',
    header: ({ column }) => <HeaderButton column={column} title="Rota (Endpoint)" />,
    cell: ({ row }) => {
      const rota = row.getValue('rota');
      return <div className="text-sm truncate max-w-md">{rota || '-'}</div>;
    },
    size: 250,
    minSize: 150,
    enableSorting: true,
    meta: {
      exportHeader: 'Rota',
      filterVariant: 'text',
    },
  },

  {
    accessorKey: 'level',
    header: ({ column }) => <HeaderButton column={column} title="Durum" />,
    cell: ({ row }) => {
      const level = row.getValue('level');
      return (
        <Badge variant={getLevelBadgeVariant(level)} className="capitalize text-xs px-2 py-0.5">
          {level || '-'}
        </Badge>
      );
    },
    size: 100,
    minSize: 80,
    enableSorting: true,
    meta: {
      exportHeader: 'Seviye',
      filterVariant: 'select',
      // filterSelectOptions: ['ERROR', 'WARN', 'INFO', 'DEBUG'], // Filtre bileşenine seçenekleri buradan veya başka bir yolla iletebilirsiniz
    },
  },

  {
    accessorKey: 'log',
    header: ({ column }) => <HeaderButton column={column} title="Log Detayı" />,
    cell: ({ row }) => {
      const logData = row.getValue('log');
      // Log içeriğinin varlığını belirten kısa bir metin.
      // Gerçek içeriği göstermek için bir modal/tooltip veya detay sayfası bağlantısı kullanılabilir.
      return <div className="text-xs text-muted-foreground italic">{logData ? 'Veri Mevcut' : 'Boş'}</div>;
    },
    enableSorting: false,
    size: 100,
    minSize: 80,
    meta: {
      exportHeader: 'Log Detayı (Durum)',
      filterVariant: 'none', // JSON içeriği doğrudan filtrelenemez
    },
  },
];
