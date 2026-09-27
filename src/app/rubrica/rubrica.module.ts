import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { RubricaPageRoutingModule } from './rubrica-routing.module';

import { RubricaPage } from './rubrica.page';

@NgModule({
  imports: [IonicModule, RubricaPageRoutingModule],
  declarations: [RubricaPage],
})
export class RubricaPageModule {}
