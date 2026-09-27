import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Legame, Utente, User } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { IonRow, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,  IonMenuButton,  IonItem,   IonButton,  IonLabel, IonSelect, IonSelectOption, IonIcon, IonList } from '@ionic/angular/standalone';

export interface fullegami {
  target: Array<Legame>;
  domitor: Array<Utente>;
}

@Component({
  selector: 'app-legami',
  templateUrl: './legami.page.html',
  styleUrls: ['./legami.page.scss'],
  imports: [FormsModule, IonRow, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonItem, IonButton, IonLabel, IonSelect, IonSelectOption, IonIcon, IonList]
})
export class LegamiPage  {
  listalegami: Array<Legame> = [];
  listautenti: Array<Utente> = [];

  private readonly cdr = inject(ChangeDetectorRef);

  pgscelto: number = 0;
  selected: string = '';

  public user = inject(User);
  private authService = inject(AuthserviceService);

  constructor() {}



  ionViewWillEnter() {
    this.loadUtenti(this.user.idutente);
    this.getlegami();

  }

  loadUtenti(a: number) {
    this.authService.listautenti(a).subscribe((res: Array<Utente>) => {
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
