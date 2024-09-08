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
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then( m => m.Tab4PageModule)
      },
      {
        path: 'tab5',
        loadChildren: () => import('../tab5/tab5.module').then( m => m.Tab5PageModule)
      },
      {
        path: 'oggetto',
        loadChildren: () => import('../oggetto/oggetto.module').then( m => m.OggettoPageModule)
      },
      {
        path: 'modificanote',
        loadChildren: () => import('../modificanote/modificanote.module').then( m => m.ModificanotePageModule)
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
        path: 'caccia/:id',
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
        loadChildren: () => import('../morte/morte.module').then( m => m.MortePageModule)
      },
      {
        path: 'addpx',
        loadChildren: () => import('../addpx/addpx.module').then( m => m.AddpxPageModule)
      },
      {
        path: 'telepatia',
        loadChildren: () => import('../telepatia/telepatia.module').then( m => m.TelepatiaPageModule)
      },
      {
        path: 'amalgame',
        loadChildren: () => import('../amalgame/amalgame.module').then( m => m.AmalgamePageModule)
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
