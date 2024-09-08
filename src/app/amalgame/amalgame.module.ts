import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmalgamePageRoutingModule } from './amalgame-routing.module';

import { AmalgamePage } from './amalgame.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmalgamePageRoutingModule
  ],
  declarations: [AmalgamePage]
})
export class AmalgamePageModule {}
