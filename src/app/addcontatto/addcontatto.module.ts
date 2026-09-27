import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddcontattoPageRoutingModule } from './addcontatto-routing.module';

import { AddcontattoPage } from './addcontatto.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    AddcontattoPageRoutingModule
  ],
  declarations: [AddcontattoPage]
})
export class AddcontattoPageModule {}
