import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonItem, IonTextarea, IonFooter, IonButton } from '@ionic/angular/standalone';
import { User } from '../globals';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-modificanote',
  templateUrl: './modificanote.page.html',
  styleUrls: ['./modificanote.page.scss'],
  imports: [FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonItem, IonTextarea, IonFooter, IonButton],
})
export class ModificanotePage  {
  user = inject(User);
  private authService = inject(AuthserviceService);

  noteiniziali = signal('');

 

  ionViewWillEnter() {
    this.noteiniziali.set(this.user.note);
  }

  noteModificate(): boolean {
    return this.user.note != this.noteiniziali();
  }

  modifica() {
    this.authService.modifcanote(this.user.idutente, this.user.note).subscribe(() => {
      this.noteiniziali.set(this.user.note);
    });
  }
}
