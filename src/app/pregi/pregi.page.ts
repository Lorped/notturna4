import { Component, inject, signal } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { User, pregiodifetto } from '../globals';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-pregi',
  templateUrl: './pregi.page.html',
  styleUrls: ['./pregi.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonNote],
})
export class PregiPage {
  user = inject(User);
  private auth = inject(AuthserviceService);

  listapregi = signal<Array<pregiodifetto>>([]);

  ionViewWillEnter() {
    this.auth.getpregi(this.user.idutente).subscribe((data: Array<pregiodifetto>) => {
      this.listapregi.set(Array.isArray(data) ? [...data] : []);
    });
  }
}
