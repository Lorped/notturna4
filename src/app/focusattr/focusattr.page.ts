import { Component, inject, signal } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonItem, IonLabel, IonText, IonList, IonItemGroup, IonItemDivider } from '@ionic/angular/standalone';
import { User } from '../globals';
import { AuthserviceService } from '../services/authservice.service';


interface Bonus {
  nomeattr: string;
  livelloattr: string;
  bonus: string;
}

interface FocusAttr {
  attr: string;
  bonus: Array<Bonus>;
}

@Component({
  selector: 'app-focusattr',
  templateUrl: './focusattr.page.html',
  styleUrls: ['./focusattr.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonItem, IonLabel, IonText, IonList, IonItemGroup, IonItemDivider],
})
export class FocusattrPage {
  private authService = inject(AuthserviceService);
  private user = inject(User);

  listafocusattr = signal<FocusAttr[]>([]);

  ionViewWillEnter() {
    this.authService.focusattr(this.user.idutente).subscribe(
      (data) => {
        this.listafocusattr.set(data);
      }
    );
  }
}
