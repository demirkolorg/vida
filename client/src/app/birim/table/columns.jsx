// birim.columns.js

// 'use client'; // JavaScript dosyasında bu direktife genellikle gerek yoktur.
// Eğer Next.js veya benzeri bir framework kullanıyorsanız ve bu dosya
// client-side render ediliyorsa, framework bunu kendi yönetir.

// Gerekli React importu (JSX kullanıldığı için)
import React from 'react';
// import type { ColumnDef } from '@tanstack/react-table'; // Tip importu kaldırıldı
import { HeaderButton } from '@/components/table/HeaderButton';
import { AvatarWithNameAndHover } from '@/components/table/AvatarWithNameAndHover'; // Personel gösterimi için
import { turkishCaseInsensitiveFilterFn } from '@/components/table/Functions';
import { Badge } from '@/components/ui/badge'; // Status gösterimi için (opsiyonel)
import { format } from 'date-fns'; // Tarih formatlama için (opsiyonel)
import { tr } from 'date-fns/locale'; // Türkçe lokalizasyon için (opsiyonel)

// YEREL - Tip importu kaldırıldı
// import type { Birim_Item as EntityItem } from '../constant/types';

// AuditStatusEnum'un string değerlerini ve renklerini eşleştirmek için bir yardımcı (opsiyonel)
const statusStyles = {
  Aktif: 'bg-green-500 hover:bg-green-600',
  Pasif: 'bg-yellow-500 hover:bg-yellow-600',
  Silindi: 'bg-red-500 hover:bg-red-600',
};

export const Birim_Columns = () => [
  // Fonksiyon dönüş tipi ek açıklaması kaldırıldı
  {
    accessorKey: 'ad',
    header: ({ column }) => <HeaderButton column={column} title="Birim Adı" />,
    cell: ({ row }) => {
      const ad = row.getValue('ad'); // 'as string' kaldırıldı
      return <div className="font-medium">{ad || '-'}</div>;
    },
    enableHiding: false,
    filterFn: turkishCaseInsensitiveFilterFn,
    size: 250,
  },
  {
    accessorKey: 'aciklama',
    header: ({ column }) => <HeaderButton column={column} title="Açıklama" />,
    cell: ({ row }) => {
      const aciklama = row.getValue('aciklama'); // 'as string' kaldırıldı
      return <div className="text-sm text-gray-600 truncate max-w-xs">{aciklama || '-'}</div>;
    },
    filterFn: turkishCaseInsensitiveFilterFn,
    size: 300,
  },
  {
    accessorKey: 'subeSayisi',
    accessorFn: row => row.subeler?.length ?? 0,
    header: ({ column }) => <HeaderButton column={column} title="Şube Sayısı" />,
    cell: ({ row }) => {
      const subeSayisi = row.original.subeler?.length ?? 0;
      return <div className="text-center w-20">{subeSayisi}</div>;
    },
    size: 100,
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'malzemeSayisi',
    accessorFn: row => row.malzemeler?.length ?? 0,
    header: ({ column }) => <HeaderButton column={column} title="Malzeme Sayısı" />,
    cell: ({ row }) => {
      const malzemeSayisi = row.original.malzemeler?.length ?? 0;
      return <div className="text-center w-24">{malzemeSayisi}</div>;
    },
    size: 120,
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <HeaderButton column={column} title="Durum" />,
    cell: ({ row }) => {
      const status = row.getValue('status'); // 'as string' kaldırıldı
      return (
        <Badge variant="outline" className={`${statusStyles[status] || 'bg-gray-500'} text-white text-xs`}>
          {status || '-'}
        </Badge>
      );
    },
    filterFn: turkishCaseInsensitiveFilterFn,
    size: 100,
    enableHiding: false,
    enableSorting: true,
  },
  {
    accessorKey: 'createdBy',
    accessorFn: row => row.createdBy?.ad,
    header: ({ column }) => <HeaderButton column={column} title="Oluşturan" />,
    cell: ({ row }) => {
      const createdByPersonel = row.original.createdBy;
      if (!createdByPersonel) return '-';
      return <AvatarWithNameAndHover name={createdByPersonel.ad || createdByPersonel.sicil || 'Bilinmiyor'} photoUrl={createdByPersonel.avatar} subText={createdByPersonel.sicil} />;
    },
    filterFn: turkishCaseInsensitiveFilterFn,
    size: 200,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <HeaderButton column={column} title="Oluşturulma Tarihi" />,
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt'); // 'as string | Date' kaldırıldı
      if (!createdAt) return '-';
      try {
        // JSX'i React.createElement'e çevirmek için React importu gerekli
        return React.createElement('div', { className: 'text-sm' }, format(new Date(createdAt), 'dd MMM yyyy, HH:mm', { locale: tr }));
      } catch (e) {
        console.log(e);
        return React.createElement('div', { className: 'text-sm text-red-500' }, 'Geçersiz Tarih');
      }
    },
    enableColumnFilter: false,
    size: 180,
  },
  {
    accessorKey: 'updatedBy',
    accessorFn: row => row.updatedBy?.ad,
    header: ({ column }) => <HeaderButton column={column} title="Düzenleyen" />,
    cell: ({ row }) => {
      const updatedBy = row.original.updatedBy;
      if (!updatedBy) return '-';
      return <AvatarWithNameAndHover name={updatedBy.ad || updatedBy.sicil || 'Bilinmiyor'} photoUrl={updatedBy.avatar} subText={updatedBy.sicil} />;
    },
    filterFn: turkishCaseInsensitiveFilterFn,
    size: 200,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <HeaderButton column={column} title="Düzenleme Tarihi" />,
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt'); // 'as string | Date' kaldırıldı
      if (!updatedAt) return '-';
      try {
        // JSX'i React.createElement'e çevirmek için React importu gerekli
        return React.createElement('div', { className: 'text-sm' }, format(new Date(updatedAt), 'dd MMM yyyy, HH:mm', { locale: tr }));
      } catch (e) {
        console.log(e);
        return React.createElement('div', { className: 'text-sm text-red-500' }, 'Geçersiz Tarih');
      }
    },
    enableColumnFilter: false,
    size: 180,
  },
  // Güncelleyen ve Güncelleme Tarihi (opsiyonel)
  /*
  {
    accessorKey: 'updatedBy',
    accessorFn: row => row.updatedBy?.ad,
    header: ({ column }) => React.createElement(HeaderButton, { column: column, title: "Güncelleyen" }),
    cell: ({ row }) => {
      const updatedByPersonel = row.original.updatedBy;
      if (!updatedByPersonel) return '-';
      return React.createElement(AvatarWithNameAndHover, {
        name: updatedByPersonel.ad || updatedByPersonel.sicil || 'Bilinmiyor',
        photoUrl: updatedByPersonel.avatar,
        subText: updatedByPersonel.sicil
      });
    },
    filterFn: turkishCaseInsensitiveFilterFn,
    size: 200,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => React.createElement(HeaderButton, { column: column, title: "Güncelleme Tarihi" }),
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt');
      if (!updatedAt) return '-';
      try {
        return React.createElement('div', { className: "text-sm" }, format(new Date(updatedAt), 'dd MMM yyyy, HH:mm', { locale: tr }));
      } catch (e) {
        return React.createElement('div', { className: "text-sm text-red-500" }, "Geçersiz Tarih");
      }
    },
    enableColumnFilter: false,
    size: 180,
  },
  */
];
