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
      title: 'TopGainLose',
      href: `/`,
      icon: 'lineChart',
      label: 'TopGainLose'
    },
    {
      title: 'Tournaments',
      href: `/tournament`,
      icon: 'swords',
      label: 'Tournaments'
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
      icon: 'lineChart',
      label: 'Overview'
    },
    {
      title: 'Brackets',
      href: `/t/${id}/brackets`,
      icon: 'swords',
      label: 'Brackets'
    },
    {
      title: 'Participants',
      href: `/t/${id}/participants`,
      icon: 'lineChart',
      label: 'Participants'
    },
    {
      title: 'Chat',
      href: `/t/${id}/chat`,
      icon: 'swords',
      label: 'Chat'
    },
    // {
    //   title: 'Compcal',
    //   href: `/t/${id}/compcal`,
    //   icon: 'swords',
    //   label: 'Compcal'
    // },
    
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
      icon: 'lineChart',
      label: 'Overview'
    },
    {
      title: 'Brackets',
      href: `/admin/edittournament/${id}/brackets`,
      icon: 'swords',
      label: 'Brackets'
    },
    {
      title: 'Participants',
      href: `/admin/edittournament/${id}/participants`,
      icon: 'lineChart',
      label: 'Participants'
    },
    {
      title: 'Chat',
      href: `/admin/edittournament/${id}/chat`,
      icon: 'swords',
      label: 'Chat'
    },
  ];
}

