import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Legame, Utente, User } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { IonRow, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,  IonMenuButton,  IonItem,   IonButton,  IonLabel, IonSelect, IonSelectOption, IonIcon, IonList } from '@ionic/angular/standalone';

export interface fullegami {
  target: Legame[];
  domitor: Utente[];
}

@Component({
  selector: 'app-legami',
  templateUrl: './legami.page.html',
  styleUrls: ['./legami.page.scss'],
  imports: [FormsModule, IonRow, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonItem, IonButton, IonLabel, IonSelect, IonSelectOption, IonIcon, IonList]
})
export class LegamiPage  {
  listalegami: Legame[] = [];
  listautenti: Utente[] = [];

  private readonly cdr = inject(ChangeDetectorRef);

  pgscelto = 0;
  selected = '';

  public user = inject(User);
  private authService = inject(AuthserviceService);




  ionViewWillEnter() {
    this.loadUtenti(this.user.idutente);
    this.getlegami();

  }

  loadUtenti(a: number) {
    this.authService.listautenti(a).subscribe((res: Utente[]) => {
      this.listautenti = res;
      this.cdr.markForCheck();
      //console.log('utenti: ', this.listautenti);
    });
  }

  invia() {
    this.authService.invialegame(this.user.idutente, this.pgscelto).subscribe(() => {
      this.getlegami();
    });
    //console.log(mypost);
  }

  getlegami() {
    this.authService.getlegami(this.user.idutente).subscribe((res: fullegami) => {
      this.listalegami = res.target;
      this.cdr.markForCheck();
      //console.log('legami: ', this.listalegami);
    });
  }

}
