import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MortePageRoutingModule } from './morte-routing.module';

import { MortePage } from './morte.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    MortePageRoutingModule
  ],
  declarations: [MortePage]
})
export class MortePageModule {}
