import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonList, IonItemSliding, IonItem, IonAvatar, IonLabel, IonIcon, IonItemOptions, IonButton, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { AuthserviceService } from '../services/authservice.service';
import { RubricaItem, User, ToChange } from '../globals';

@Component({
  selector: 'app-rubrica',
  templateUrl: './rubrica.page.html',
  styleUrls: ['./rubrica.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonList, IonItemSliding, IonItem, IonAvatar, IonLabel, IonIcon, IonItemOptions, IonButton, IonFab, IonFabButton],
})
export class RubricaPage  {
  private authservice = inject(AuthserviceService);
  private user = inject(User);
  private router = inject(Router);
  private tochange = inject(ToChange);

  rubrica = signal<Array<RubricaItem>>([]);

   ionViewWillEnter(){
    this.authservice.loadrubrica(this.user.idutente).subscribe((data) => {
      this.rubrica.set(data);
    });
   }

  add() {
    this.router.navigate(['/tabs/addcontatto']);
  }
  edit(id: number) {
    const tochange=this.rubrica().find((item) => item.idrubrica === id);
    if(tochange) {
      this.tochange.idrubrica = tochange.idrubrica;
      this.tochange.contatto = tochange.contatto;
      this.tochange.cell = tochange.cell;
      this.tochange.home = tochange.home;
      this.tochange.note = tochange.note;

      this.router.navigate(['/tabs/changecontatto']);
    }


  }

  delete(id: number) {
    this.authservice.delrubrica(id).subscribe(() => {
      this.authservice.loadrubrica(this.user.idutente).subscribe(() => {
        this.ionViewWillEnter();
      });
    });
  }

}
