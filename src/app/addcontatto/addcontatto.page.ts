import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton, IonRow, IonCol, IonAvatar, IonItem, IonInput, IonCheckbox, IonButton } from '@ionic/angular/standalone';
import { User } from '../globals';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-addcontatto',
  templateUrl: './addcontatto.page.html',
  styleUrls: ['./addcontatto.page.scss'],
  imports: [FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton, IonRow, IonCol, IonAvatar, IonItem, IonInput, IonCheckbox, IonButton],
})
export class AddcontattoPage  {
  contatto = signal('');
  cell = signal(0);
  home = signal(0);
  note = signal('');

  router = inject(Router);
  user = inject(User);
  authservice = inject(AuthserviceService);

  add() {
    this.authservice.addcontatto(
      this.user.idutente,
      this.contatto(),
      this.cell(),
      this.home(),
      this.note()
    ).subscribe(() => {
      this.router.navigate(['/tabs/rubrica']);
    });
  }

  ionViewWillEnter() {
    this.contatto.set('');
    this.cell.set(0);
    this.home.set(0);
    this.note.set('');
  }
}
