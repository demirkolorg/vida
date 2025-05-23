import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { getInitials } from '@/components/table/Functions'; // getInitials fonksiyonunun yolu doğru olmalı

export const AvatarWithName = ({
  name,
  photoUrl,
  imageProxyBaseUrl = '',//'https://mulkiamirserver.vercel.app/image/proxy?url=', // Varsayılan proxy
  placeholderUrl = '/placeholder.png', // Varsayılan placeholder
  avatarClassName = 'h-8 w-8', // Varsayılan avatar boyutu
  nameClassName = 'max-w-[200px] truncate font-medium', // Varsayılan isim stili
  containerClassName = 'flex items-center mx-4 gap-4 ', // Varsayılan kapsayıcı stili (mx-4 dahil)
  hoverImageClassName = 'aspect-square h-auto w-96 rounded-md object-cover shadow-lg', // Varsayılan hover resim stili
}) => {
  let displayUrl = placeholderUrl;
  if (photoUrl) {
    try {
      const encodedUrl = encodeURIComponent(photoUrl);
      displayUrl = `${imageProxyBaseUrl}${encodedUrl}`;
    } catch (e) {
      console.error('URL encoding error in AvatarWithNameAndHover:', e);
    }
  }
  const displayName = name || 'İsim Yok';
  const triggerContent = (
    <div className={containerClassName}>
      <Avatar className={avatarClassName}>
        <AvatarImage src={displayUrl} alt={displayName ?? 'Fotoğraf'} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback> {/* getInitials null/undefined'ı handle etmeli */}
      </Avatar>
      <span className={nameClassName}>{displayName}</span>
    </div>
  );

  if (photoUrl) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>{triggerContent}</HoverCardTrigger>
        <HoverCardContent className="w-auto p-0" side="top" align="center" sideOffset={3}>
          <img src={displayUrl} alt={displayName ?? 'Büyük Fotoğraf'} className={hoverImageClassName} />
        </HoverCardContent>
      </HoverCard>
    );
  }
  return triggerContent;
};