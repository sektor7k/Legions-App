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
