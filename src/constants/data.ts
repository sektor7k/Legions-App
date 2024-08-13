import { NavItem } from '@/app/types';
import { Session } from 'next-auth';

export function getNavItems(session: Session | null): NavItem[] {
  const username = session?.user?.username || 'defaultUsername';

  return [
    {
      title: 'Dashboard',
      href: `/u/${username}`,
      icon: 'dashboard',
      label: 'Dashboard'
    },
    {
      title: 'User',
      href: `/dashboard/user/${username}`,
      icon: 'user',
      label: 'user'
    },
    {
      title: 'Employee',
      href: `/dashboard/employee/${username}`,
      icon: 'employee',
      label: 'employee'
    },
    {
      title: 'Profile',
      href: `/u/${username}/profile`,
      icon: 'profile',
      label: 'profile'
    },
    {
      title: 'Kanban',
      href: `/dashboard/kanban/${username}`,
      icon: 'kanban',
      label: 'kanban'
    },
    {
      title: 'Login',
      href: '/',
      icon: 'login',
      label: 'login'
    }
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

export function getNavItemsTournament(session: Session | null): NavItem[] {
  const username = session?.user?.username || 'defaultUsername';

  return [
    {
      title: 'Overview',
      href: `/t`,
      icon: 'lineChart',
      label: 'Overview'
    },
    {
      title: 'Brackets',
      href: `/t2`,
      icon: 'swords',
      label: 'Brackets'
    },
    {
      title: 'Participants',
      href: `/t3`,
      icon: 'lineChart',
      label: 'Participants'
    },
    {
      title: 'Chat',
      href: `/t4`,
      icon: 'swords',
      label: 'Chat'
    },
  ];
}
