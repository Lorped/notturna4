import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { TaumPageRoutingModule } from './taum-routing.module';

import { TaumPage } from './taum.page';

@NgModule({
  imports: [
    IonicModule,
    TaumPageRoutingModule
  ],
  declarations: [TaumPage]
})
export class TaumPageModule {}
