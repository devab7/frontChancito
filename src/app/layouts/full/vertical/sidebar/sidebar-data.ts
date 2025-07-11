import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [

  // {
  //   displayName: 'Escritorio',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/dashboards/dashboard1',
  // },
  {
    displayName: 'Clientes',
    iconName: 'solar:users-group-rounded-broken',
    route: '/pages/clientes',
  },
  {
    displayName: 'Cuotas',
    iconName: 'solar:chat-round-money-outline',
    route: '/pages/cuotas',
  },
  {
    displayName: 'Cuotas Diarias',
    iconName: 'solar:hand-money-outline',
    route: '/pages/cuotas-dia',
  },
  {
    displayName: 'Cuotas Mensuales',
    iconName: 'solar:chat-round-money-outline',
    route: '/pages/cuotas-mes',
  },
];
