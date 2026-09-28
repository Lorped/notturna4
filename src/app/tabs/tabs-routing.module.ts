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
        loadComponent: () => import('../tab1/tab1.page').then(m => m.Tab1Page)
      },
      {
        path: 'tab2',
        loadComponent: () => import('../tab2/tab2.page').then(m => m.Tab2Page)
      },
      {
        path: 'tab3',
        loadComponent: () => import('../tab3/tab3.page').then(m => m.Tab3Page)
      },
      {
        path: 'tab5',
        loadComponent: () => import('../tab5/tab5.page').then( m => m.Tab5Page)
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
        loadComponent: () => import('../poteri/poteri.page').then( m => m.PoteriPage)
      },
      {
        path: 'taum',
        loadComponent: () => import('../taum/taum.page').then( m => m.TaumPage)
      },
      {
        path: 'necro',
        loadComponent: () => import('../necro/necro.page').then( m => m.NecroPage)
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
