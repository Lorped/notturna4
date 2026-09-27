import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoteriPageRoutingModule } from './poteri-routing.module';

import { PoteriPage } from './poteri.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    PoteriPageRoutingModule
  ],
  declarations: [PoteriPage]
})
export class PoteriPageModule {}
