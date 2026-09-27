import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { PregiPageRoutingModule } from './pregi-routing.module';

import { PregiPage } from './pregi.page';

@NgModule({
  imports: [IonicModule, PregiPageRoutingModule],
  declarations: [PregiPage],
})
export class PregiPageModule {}
