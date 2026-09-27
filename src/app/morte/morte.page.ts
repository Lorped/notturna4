import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonButton } from '@ionic/angular/standalone';
import { User } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-morte',
  templateUrl: './morte.page.html',
  styleUrls: ['./morte.page.scss'],
  imports: [FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonButton],
})
export class MortePage {
  user = inject(User);
  authservice = inject(AuthserviceService);
  private session = inject(SessionService);

  morte() {
    this.authservice.morteultima(this.user['idutente']).subscribe(() => {
      void this.session.logout();
    });
  }
}
