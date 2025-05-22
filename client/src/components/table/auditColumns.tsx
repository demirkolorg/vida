// src/components/table/auditColumns.tsx
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HeaderButton } from "@/components/table/HeaderButton";
import { AvatarWithNameAndHover } from "@/components/table/AvatarWithNameAndHover";
import { turkishCaseInsensitiveFilterFn } from "@/components/table/Functions";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { StatusCell } from "@/components/table/StatusCell";

interface PersonelReference {
  id: string; // veya kullandığınız ID tipi
  ad?: string | null;
  sicil?: string | null;
  avatar?: string | null;
}

interface AuditableBase {
  createdBy?: PersonelReference | null;
  createdAt?: string | Date | null; // API'den string gelip Date'e çevrilebilir
  updatedBy?: PersonelReference | null;
  updatedAt?: string | Date | null;
}

// Generic TData, AuditableBase'i (veya benzer bir arayüzü) extend etmeli
// Bu, row.original.createdBy gibi erişimlerin tip güvenli olmasını sağlar.
export const getAuditColumns = <TData extends AuditableBase>(): ColumnDef<
  TData,
  any
>[] => [
  {
    accessorKey: "status",
    header: ({ column }) => <HeaderButton column={column} title="Durum" />,
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <StatusCell status={status} />;
    },
    size: 100,
    enableHiding: false,
    enableSorting: true,
    meta: {
      exportHeader: "Durum",
    },
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => <HeaderButton column={column} title="Oluşturan" />,
    cell: ({ row }) => {
      const createdByPersonel = row.original.createdBy as
        | PersonelReference
        | undefined
        | null; // Tip ataması
      if (!createdByPersonel) return "-";
      return (
        <AvatarWithNameAndHover
          name={createdByPersonel.ad || createdByPersonel.sicil || "Bilinmiyor"}
          photoUrl={createdByPersonel.avatar}
          subText={createdByPersonel.sicil}
        />
      );
    },
    accessorFn: (row) =>
      (row.createdBy as PersonelReference | undefined | null)?.ad, // Filtreleme ve sıralama için
    filterFn: turkishCaseInsensitiveFilterFn,
    size: 200,
    enableHiding: true, // Varsayılan olarak gizlenebilir olsun
    meta: {
      exportHeader: "Oluşturan",
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <HeaderButton column={column} title="Oluşturulma Tarihi" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (!createdAt) return "-";
      try {
        return (
          <div className="text-sm">
            {format(new Date(createdAt), "dd MMM yyyy, HH:mm", { locale: tr })}
          </div>
        );
      } catch (e) {
        console.error("createdAt format error:", e, createdAt);
        return <div className="text-sm text-red-500">Geçersiz Tarih</div>;
      }
    },
    enableColumnFilter: false,
    size: 180,
    enableHiding: true, // Varsayılan olarak gizlenebilir olsun
    meta: {
      exportHeader: "Oluşturulma Tarihi",
    },
  },
  {
    accessorKey: "updatedBy",
    header: ({ column }) => <HeaderButton column={column} title="Düzenleyen" />,
    cell: ({ row }) => {
      const updatedByPersonel = row.original.updatedBy as
        | PersonelReference
        | undefined
        | null; // Tip ataması
      if (!updatedByPersonel) return "-";
      return (
        <AvatarWithNameAndHover
          name={updatedByPersonel.ad || updatedByPersonel.sicil || "Bilinmiyor"}
          photoUrl={updatedByPersonel.avatar}
          subText={updatedByPersonel.sicil}
        />
      );
    },
    accessorFn: (row) =>
      (row.updatedBy as PersonelReference | undefined | null)?.ad, // Filtreleme ve sıralama için
    filterFn: turkishCaseInsensitiveFilterFn,
    size: 200,
    enableHiding: true, // Varsayılan olarak gizlenebilir olsun
    meta: {
      exportHeader: "Düzenleyen",
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <HeaderButton column={column} title="Düzenleme Tarihi" />
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      if (!updatedAt) return "-";
      try {
        return (
          <div className="text-sm">
            {format(new Date(updatedAt), "dd MMM yyyy, HH:mm", { locale: tr })}
          </div>
        );
      } catch (e) {
        console.error("updatedAt format error:", e, updatedAt);
        return <div className="text-sm text-red-500">Geçersiz Tarih</div>;
      }
    },
    enableColumnFilter: false,
    size: 180,
    enableHiding: true, // Varsayılan olarak gizlenebilir olsun
    meta: {
      exportHeader: "Düzenleme Tarihi",
    },
  },
];
