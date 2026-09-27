import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { BackgroundPageRoutingModule } from './background-routing.module';

import { BackgroundPage } from './background.page';

import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [CommonModule, IonicModule, BackgroundPageRoutingModule, PipesModule],
  declarations: [BackgroundPage],
})
export class BackgroundPageModule {}
