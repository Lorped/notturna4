import { Component, inject } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonRow, IonCol } from '@ionic/angular/standalone';
import { User, Userskill } from '../globals';
import { PipesModule } from '../pipes/pipes.module';

@Component({
  selector: 'app-background',
  templateUrl: './background.page.html',
  styleUrls: ['./background.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonRow, IonCol, PipesModule],
})
export class BackgroundPage  {
  user = inject(User);
  userskill = inject(Userskill);

}
