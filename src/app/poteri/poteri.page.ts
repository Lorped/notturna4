import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { User, Potere, Userskill, Utente } from '../globals';
import { ActivatedRoute } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { finalize } from 'rxjs';
import { ResourceActionService } from '../services/resource-action.service';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';

addIcons({ 'person-outline': personOutline });

export interface EsitoPotere {
  tiro: number;
}


@Component({
  selector: 'app-poteri',
  templateUrl: './poteri.page.html',
  styleUrls: ['./poteri.page.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonModal,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
  ],
})
export class PoteriPage implements OnInit {
  disc = 0;
  nomed = '';
  CacciaAnimalita = 1;

  mypoteri: Array<Potere> = [];

  esito: EsitoPotere = { 
    tiro: 0
  };

  canDismiss = false;   // per il modal
  presentingElement: HTMLElement | null = null;   // per il modal
  messaggioTelepatico = '';
  isModalOpen = false;

  listautenti: Array<Utente> = [];
  pgscelto = 0;

  public user = inject(User);
  public userskill = inject(Userskill);
  public activatedroute = inject(ActivatedRoute);
  public authservice = inject(AuthserviceService);
  public alertCtrl = inject(AlertController);
  public resourceActions = inject(ResourceActionService);
  private changeDetectorRef = inject(ChangeDetectorRef);


  ngOnInit() { 
    this.authservice.listautenti(this.user.idutente).subscribe((res: Array<Utente>) => {
      this.listautenti = res;
      this.changeDetectorRef.markForCheck();
    });
  }

  ionViewWillEnter() {
    const paramMap = this.activatedroute.snapshot.paramMap;
    this.disc = Number(paramMap.get('disc'));
    this.nomed = paramMap.get('nomed')!;

    for (let i = 0; i < this.userskill.discipline.length; i++) {
      if (this.userskill.discipline[i].iddisciplina == this.disc) {
        this.mypoteri = this.userskill.discipline[i].poteri;
        // console.log(this.mypoteri);
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  gopotere(pot: string, livellopot: number, idpotere: number) {
    // console.log(pot);

    if (pot == 'Telepatia') {
      this.pgscelto = 0;
      this.messaggioTelepatico = '';
      this.isModalOpen = true;
    } else {
      if (!this.resourceActions.tryStart()) {
        return;
      }

      this.authservice.usopotere(this.user['idutente'], pot, idpotere,  livellopot, this.nomed)
        .pipe(finalize(() => this.resourceActions.finish()))
        .subscribe((res) => {

        this.esito.tiro = res.tiro;

        // console.log('esito potere: ' + this.esito.tiro);

        
        if (livellopot == 5 ) {
          this.user.PScorrenti = this.user.PScorrenti - 2;
        } else {
          this.user.PScorrenti = this.user.PScorrenti - 1;
        }
        this.user.puntiSangueAggiornati.next();
        if (idpotere== 15) {
          this.user.nummaesta = this.user.nummaesta - 1;
        }

        if (this.nomed == 'Ascendente' || this.nomed == 'Dominazione' || this.nomed == 'Demenza' || this.nomed == 'Serpentis'  ) {
          this.showalert(pot, livellopot,"T");
        } else {
          this.showalert(pot, livellopot, "NT");
        }

        if (this.user.PScorrenti <= this.user.frenesia) {
          console.log('a rischio frenesia');
        } else if (this.user.PScorrenti <= this.user.cacciaobbligata) {
          console.log('in caccia obbligata');
        } 
        this.changeDetectorRef.markForCheck();

      });
    }
  }

  async showalert(pot: string, livellopot: number, tipo: string) {

    let messaggio = '';
    if (tipo == "T") {
      messaggio = '[Tiro contrapposto: ' + this.esito.tiro + ']';
    } else {
      messaggio = '';
    }

    const alert = await this.alertCtrl.create({
      header: pot,
      subHeader: this.nomed + ' (Livello ' + livellopot + ')',
      message: messaggio,
      buttons: ['OK'],
      cssClass: 'myalert',
    });
    alert.present();
  }

  cacciaanim() {
    if (!this.resourceActions.tryStart()) {
      return;
    }

    this.authservice.cacciaanim(this.user['idutente'])
      .pipe(finalize(() => this.resourceActions.finish()))
      .subscribe(() => {
      this.user['PScorrenti'] = this.user['PScorrenti'] + 3 > this.user['maxps'] ? this.user['maxps'] : this.user['PScorrenti'] + 3;
      this.user.puntiSangueAggiornati.next();
      this.showalert('Richiamo', 3, "NT");
      this.CacciaAnimalita = 0;
      this.changeDetectorRef.markForCheck();

      setTimeout(() => {
        this.CacciaAnimalita = 1;
        this.changeDetectorRef.markForCheck();
      }, 3600000); // 60 minuti in millisecondi 
      

    });
  }

    
  mandaMessaggio() {
    if (!this.resourceActions.tryStart()) {
      return;
    }

    this.isModalOpen = false;
    // console.log('mandaMessaggio: ' + this.messaggioTelepatico);
    // console.log('pgscelto: ' + this.pgscelto);
    this.authservice.inviamessaggiotente(this.user['idutente'], this.pgscelto, this.messaggioTelepatico)
      .pipe(finalize(() => this.resourceActions.finish()))
      .subscribe(() => {
      this.user['PScorrenti']--;
      this.user.puntiSangueAggiornati.next();
      this.showalert('Telepatia', 1, "NT");
      this.pgscelto = 0;
      this.messaggioTelepatico = '';
      this.changeDetectorRef.markForCheck();
    });

  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  
}
