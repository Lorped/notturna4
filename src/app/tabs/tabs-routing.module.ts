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
        loadChildren: () => import('../modificanote/modificanote.module').then( m => m.ModificanotePageModule)
      },
      {
        path: 'background',
        loadComponent: () => import('../background/background.page').then( m => m.BackgroundPage)
      },
      {
        path: 'rubrica',
        loadChildren: () => import('../rubrica/rubrica.module').then( m => m.RubricaPageModule)
      },
      {
        path: 'addcontatto',
        loadChildren: () => import('../addcontatto/addcontatto.module').then( m => m.AddcontattoPageModule)
      },
      {
        path: 'changecontatto',
        loadChildren: () => import('../changecontatto/changecontatto.module').then( m => m.ChangecontattoPageModule)
      },
      {
        path: 'pregi',
        loadComponent: () => import('../pregi/pregi.page').then( m => m.PregiPage)
      },
      {
        path: 'caccia',
        loadChildren: () => import('../caccia/caccia.module').then( m => m.CacciaPageModule)
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
        loadChildren: () => import('../legami/legami.module').then( m => m.LegamiPageModule)
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
