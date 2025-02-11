import { NavItem } from '@/app/types';
import { Session } from 'next-auth';

export function getNavItems(session: Session | null): NavItem[] {
  const username = session?.user?.username || 'defaultUsername';

  return [
    {
      title: 'Profile',
      href: `/u/${username}/profile`,
      icon: 'profile',
      label: 'profile'
    },
    {
      title: 'Inbox',
      href: `/u/${username}/inbox`,
      icon: 'inbox',
      label: 'Inbox'
    },
    {
      title: 'Outbox',
      href: `/u/${username}/outbox`,
      icon: 'outbox',
      label: 'Outbox'
    },
  ];
}

export function getNavItemsBrowse(session: Session | null): NavItem[] {
  const username = session?.user?.username || 'defaultUsername';

  return [ 
    {
      title: 'Home',
      href: `/`,
      icon: 'house',
      label: 'Home'
    },
    {
      title: 'Tournaments',
      href: `/tournament`,
      icon: 'swords',
      label: 'Tournaments'
    },
    {
      title: 'Emporium',
      href: `/#`,
      icon: 'shoppingBag',
      label: 'Tournaments'
    },
    {
      title: 'PVP Arena',
      href: `/#`,
      icon: 'circleDollarSign',
      label: 'bet'
    },
    
  ];
} 

export function getNavItemsTournament(params?: { id: string }): NavItem[] {
  // params'ın tanımlı olup olmadığını ve id'nin mevcut olup olmadığını kontrol et
  if (!params || !params.id) {
    console.error('params veya params.id tanımlı değil');
    return [];
  }

  const id = params.id;
  
  return [
    {
      title: 'Overview',
      href: `/t/${id}`,
      icon: 'info',
      label: 'Overview'
    },
    {
      title: 'Brackets',
      href: `/t/${id}/brackets`,
      icon: 'network',
      label: 'Brackets'
    },
    {
      title: 'Participants',
      href: `/t/${id}/participants`,
      icon: 'users',
      label: 'Participants'
    },
    {
      title: 'Chat',
      href: `/t/${id}/chat`,
      icon: 'messageMore',
      label: 'Chat'
    },
    {
      title: 'Compcal',
      href: `/t/${id}/compcal`,
      icon: 'gamepad',
      label: 'Compcal'
    },
    
  ];
}

export function getNavItemsTournamentAdmin(params?: { id: string }): NavItem[] {
  // params'ın tanımlı olup olmadığını ve id'nin mevcut olup olmadığını kontrol et
  if (!params || !params.id) {
    console.error('params veya params.id tanımlı değil');
    return [];
  }

  const id = params.id;
  
  return [
    {
      title: 'Overview',
      href: `/admin/edittournament/${id}`,
      icon: 'info',
      label: 'Overview'
    },
    {
      title: 'Brackets',
      href: `/admin/edittournament/${id}/brackets`,
      icon: 'network',
      label: 'Brackets'
    },
    {
      title: 'Participants',
      href: `/admin/edittournament/${id}/participants`,
      icon: 'users',
      label: 'Participants'
    },
    {
      title: 'Chat',
      href: `/admin/edittournament/${id}/chat`,
      icon: 'messageMore',
      label: 'Chat'
    },
    {
      title: 'Compcal',
      href: `/admin/edittournament/${id}/compcal`,
      icon: 'gamepad',
      label: 'Compcal'
    },
    {
      title: 'Result',
      href: `/admin/edittournament/${id}/result`,
      icon: 'post',
      label: 'Result'
    },
    {
      title: 'Settings',
      href: `/admin/edittournament/${id}/settings`,
      icon: 'settings',
      label: 'Settings'
    },
  ];
}

