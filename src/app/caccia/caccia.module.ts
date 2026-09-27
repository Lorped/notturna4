import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { CacciaPageRoutingModule } from './caccia-routing.module';

import { CacciaPage } from './caccia.page';

@NgModule({
  imports: [
    IonicModule,
    CacciaPageRoutingModule
  ],
  declarations: [CacciaPage]
})
export class CacciaPageModule {}
