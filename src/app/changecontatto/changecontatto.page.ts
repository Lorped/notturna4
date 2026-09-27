import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton, IonRow, IonCol, IonAvatar, IonItem, IonInput, IonCheckbox, IonButton } from '@ionic/angular/standalone';
import { ToChange } from '../globals';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-changecontatto',
  templateUrl: './changecontatto.page.html',
  styleUrls: ['./changecontatto.page.scss'],
  imports: [FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton, IonRow, IonCol, IonAvatar, IonItem, IonInput, IonCheckbox, IonButton],
})
export class ChangecontattoPage  {
  cellChecked = signal(true);
  homeChecked = signal(true);

  tochange = inject(ToChange);
  router = inject(Router);
  authservice = inject(AuthserviceService);

  change() {
    this.tochange.cell = this.cellChecked() ? 1 : 0;
    this.tochange.home = this.homeChecked() ? 1 : 0;

    this.authservice.changerubrica(
      this.tochange.idrubrica,
      this.tochange.contatto, 
      this.tochange.cell,
      this.tochange.home,
      this.tochange.note
    ).subscribe(() => {
      this.router.navigate(['/tabs/rubrica']);
    });

  
  }

  ionViewWillEnter() {
    this.cellChecked.set(this.tochange.cell != 0);
    this.homeChecked.set(this.tochange.home != 0);
  }
}
