import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; // Ajustez le chemin d'import
import { IconFolderOpen } from '@tabler/icons-react';

export interface UserAvatarProps {
  name: string;
  avatar: string;
  dossiersCount?: number;
}

interface AvatarBadgeProps {
  count: number;
}

export const getInitials = (name: string, maxLength: number = 2): string => {
  if (!name.trim()) return '';
  
  return name
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
};


export const AvatarBadge: React.FC<AvatarBadgeProps> = ({ count }) => (
  <div className="absolute -bottom-1 -right-1">
    <div className="flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-linear-to-r from-red-500 to-red-600 text-white text-xs font-bold shadow-sm border-2 border-white dark:border-gray-800">
      {count}
    </div>
  </div>
);


interface UserInfoProps {
  name: string;
  dossiersCount?: number;
}

export const UserInfo: React.FC<UserInfoProps> = ({ name, dossiersCount }) => (
  <div className="flex flex-col items-start gap-1">
    <span className="font-medium text-gray-900 dark:text-gray-100">{name}</span>
    {dossiersCount ? (
      <DossierInfo count={dossiersCount} />
    ) : (
      <EmptyDossierInfo />
    )}
  </div>
);

const DossierInfo: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
    <IconFolderOpen className="h-3 w-3" />
    <span>{count} dossier{count > 1 ? 's' : ''}</span>
  </div>
);

const EmptyDossierInfo: React.FC = () => (
  <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
    <span className="text-xs text-gray-400 dark:text-gray-500">
      Aucun dossier enregistré
    </span>
  </div>
);

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  avatar, 
  dossiersCount 
}) => {
  const showBadge = dossiersCount !== undefined && dossiersCount > 0;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className="h-10 w-10 ring-2 ring-slate-200 dark:ring-slate-700 transition-all hover:ring-slate-400">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-linear-to-br from-slate-500 to-slate-600 text-white text-sm">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        {showBadge && <AvatarBadge count={dossiersCount} />}
      </div>
      
      <UserInfo name={name} dossiersCount={dossiersCount} />
    </div>
  );
};

// // hooks/useUserAvatar.ts (optionnel - pour la logique métier)
// import { useMemo } from 'react';

// export const useUserAvatar = (name: string, dossiersCount?: number) => {
//   const initials = useMemo(() => getInitials(name), [name]);
//   const showBadge = useMemo(() => 
//     dossiersCount !== undefined && dossiersCount > 0, 
//     [dossiersCount]
//   );
  
//   return {
//     initials,
//     showBadge,
//     hasDossiers: showBadge,
//     dossiersText: dossiersCount === 1 ? 'dossier' : 'dossiers'
//   };
// };