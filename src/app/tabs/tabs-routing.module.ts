import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'tab5',
        loadChildren: () => import('../tab5/tab5.module').then( m => m.Tab5PageModule)
      },
      {
        path: 'modificanote',
        loadComponent: () => import('../modificanote/modificanote.page').then( m => m.ModificanotePage)
      },
      {
        path: 'background',
        loadComponent: () => import('../background/background.page').then( m => m.BackgroundPage)
      },
      {
        path: 'rubrica',
        loadComponent: () => import('../rubrica/rubrica.page').then( m => m.RubricaPage)
      },
      {
        path: 'addcontatto',
        loadComponent: () => import('../addcontatto/addcontatto.page').then( m => m.AddcontattoPage)
      },
      {
        path: 'changecontatto',
        loadComponent: () => import('../changecontatto/changecontatto.page').then( m => m.ChangecontattoPage)
      },
      {
        path: 'pregi',
        loadComponent: () => import('../pregi/pregi.page').then( m => m.PregiPage)
      },
      {
        path: 'caccia',
        loadComponent: () => import('../caccia/caccia.page').then( m => m.CacciaPage)
      },
      {
        path: 'poteri/:disc/:nomed',
        loadChildren: () => import('../poteri/poteri.module').then( m => m.PoteriPageModule)
      },
      {
        path: 'taum',
        loadChildren: () => import('../taum/taum.module').then( m => m.TaumPageModule)
      },
      {
        path: 'necro',
        loadChildren: () => import('../necro/necro.module').then( m => m.NecroPageModule)
      },
      {
        path: 'legami',
        loadComponent: () => import('../legami/legami.page').then( m => m.LegamiPage)
      },
      {
        path: 'morte',
        loadComponent: () => import('../morte/morte.page').then( m => m.MortePage)
      },
      {
        path: 'focusattr',
        loadComponent: () => import('../focusattr/focusattr.page').then( m => m.FocusattrPage)
      },        
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
