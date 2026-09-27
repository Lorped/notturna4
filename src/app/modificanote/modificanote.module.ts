import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificanotePageRoutingModule } from './modificanote-routing.module';

import { ModificanotePage } from './modificanote.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    ModificanotePageRoutingModule
  ],
  declarations: [ModificanotePage]
})
export class ModificanotePageModule {}
