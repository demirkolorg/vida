import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { getInitials } from '@/components/table/Functions'; // getInitials fonksiyonunun yolu doğru olmalı

export const AvatarWithName = ({
  name,
  sicil,
  avatar,
  avatarClassName = 'h-8 w-8', // Varsayılan avatar boyutu
  nameClassName = 'max-w-[200px] truncate font-medium', // Varsayılan isim stili
  sicilClassName = 'max-w-[200px] truncate text-xs text-muted-foreground', // Varsayılan isim stili
  containerClassName = 'flex items-center mx-4 gap-4 ', // Varsayılan kapsayıcı stili (mx-4 dahil)
  hoverImageClassName = 'aspect-square h-auto w-96 rounded-md object-cover shadow-lg', // Varsayılan hover resim stili
}) => {

  const displayName = name || 'İsim Yok';
  const triggerContent = (
    <div className={containerClassName}>
      <Avatar className={avatarClassName}>
        <AvatarImage src={avatar} alt={displayName ?? 'Fotoğraf'} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback> {/* getInitials null/undefined'ı handle etmeli */}
      </Avatar>
      <div className='flex flex-col justify-center'>

      <span className={nameClassName}>{displayName}</span>
      <span className={sicilClassName}>{sicil}</span>
      </div>
    </div>
  );

  if (avatar) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>{triggerContent}</HoverCardTrigger>
        <HoverCardContent className="w-auto p-0" side="top" align="center" sideOffset={3}>
          <img src={avatar} alt={displayName ?? 'Büyük Fotoğraf'} className={hoverImageClassName} />
        </HoverCardContent>
      </HoverCard>
    );
  }
  return triggerContent;
};