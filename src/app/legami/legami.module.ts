import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LegamiPageRoutingModule } from './legami-routing.module';

import { LegamiPage } from './legami.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    LegamiPageRoutingModule
  ],
  declarations: [LegamiPage]
})
export class LegamiPageModule {}
