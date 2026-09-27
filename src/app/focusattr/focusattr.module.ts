import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { FocusattrPageRoutingModule } from './focusattr-routing.module';

import { FocusattrPage } from './focusattr.page';

@NgModule({
  imports: [IonicModule, FocusattrPageRoutingModule],
  declarations: [FocusattrPage],
})
export class FocusattrPageModule {}
