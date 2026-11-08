import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton, IonRow, IonCol, IonAvatar, IonItem, IonInput, IonCheckbox, IonButton } from '@ionic/angular';
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
  contatto = signal('');
  note = signal('');
  cellChecked = signal(false);
  homeChecked = signal(false);

  tochange = inject(ToChange);
  router = inject(Router);
  authservice = inject(AuthserviceService);

  change() {
    this.authservice.changerubrica(
      this.tochange.idrubrica,
      this.contatto(),
      this.cellChecked() ? 1 : 0,
      this.homeChecked() ? 1 : 0,
      this.note()
    ).subscribe(() => {
      this.router.navigate(['/tabs/rubrica']);
    });

  }

  ionViewWillEnter() {
    this.contatto.set(this.tochange.contatto);
    this.note.set(this.tochange.note);
    this.cellChecked.set(this.tochange.cell != 0);
    this.homeChecked.set(this.tochange.home != 0);
  }
}
