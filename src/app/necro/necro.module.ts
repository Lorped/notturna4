import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { NecroPageRoutingModule } from './necro-routing.module';

import { NecroPage } from './necro.page';

@NgModule({
  imports: [
    IonicModule,
    NecroPageRoutingModule
  ],
  declarations: [NecroPage]
})
export class NecroPageModule {}
