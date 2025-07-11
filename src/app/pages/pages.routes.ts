import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { Clientes } from './clientes/clientes.component';
import { ViewComponent } from './clientes/view/view.component';
import { Cuotas } from './cuotas/cuotas.component';
import { CuotasDia } from './cuotas-dia/cuotas-dia.component';
import { CuotasMesComponent } from './cuotas-mes/cuotas-mes.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter',
      urls: [
        { title: 'Dashboard', url: '/starter' },
        { title: 'Starter' },
      ],
    },
  },
  {
    path: 'clientes',
    component: Clientes,
    data: {
      title: 'Clientes',
      // breadcrumb: true,
      urls: [
        { title: 'Escritorio', url: '/dashboards/dashboard1' },
        { title: 'Clientes' },
      ],
    },
  },
    {
    path: 'clientes/:id',
    component: ViewComponent,
    data: {
      title: 'Detalle Cliente',
      // breadcrumb: true,
      urls: [
        { title: 'Escritorio', url: '/dashboards/dashboard1' },
        { title: 'Detalle Cliente' },
      ],
    },
  },
  {
  path: 'cuotas',
  component: Cuotas,
  data: {
    title: 'Cuotas',
    // breadcrumb: true,
    urls: [
      { title: 'Escritorio', url: '/dashboards/dashboard1' },
      { title: 'Cuotas' },
    ],
  },
  },
  {
    path: 'cuotas-dia',
    component: CuotasDia,
    data: {
      title: 'Cuotas Diarias',
      // breadcrumb: true,
      urls: [
        { title: 'Escritorio', url: '/dashboards/dashboard1' },
        { title: 'Cuotas Diarias' },
      ],
    },
  },
  {
    path: 'cuotas-mes',
    component: CuotasMesComponent,
    data: {
      title: 'Cuotas Mensuales',
      // breadcrumb: true,
      urls: [
        { title: 'Escritorio', url: '/dashboards/dashboard1' },
        { title: 'Cuotas Mensuales' },
      ],
    },
  },

];
