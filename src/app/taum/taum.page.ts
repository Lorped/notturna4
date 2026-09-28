import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { User, Userskill } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { ResourceActionService } from '../services/resource-action.service';

export interface EsitoPotere {
  tiro: number;
}

@Component({
  selector: 'app-taum',
  templateUrl: './taum.page.html',
  styleUrls: ['./taum.page.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonRow,
    IonTitle,
    IonToolbar,
  ],
})
export class TaumPage {
  
  FurtoVitae = 1;
  esito: EsitoPotere = { 
    tiro: 0
  };
  
  public user = inject(User);
  public userskill = inject(Userskill);
  public alertCtrl = inject(AlertController);
  public authService = inject(AuthserviceService);
  public resourceActions = inject(ResourceActionService);
  private changeDetectorRef = inject(ChangeDetectorRef);


  gotaum(livellopot: number, pot: string, taum: string, idtaum2: number) {
    //console.log(pot2);
    //console.log(livellopot);
    if (!this.resourceActions.tryStart()) {
      return;
    }

  this.authService.usonecrotaum(this.user['idutente'], pot, idtaum2,  livellopot, taum, 'T')
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

    this.showalert(taum, pot, livellopot);
    this.changeDetectorRef.markForCheck();

      if (this.user.PScorrenti <= this.user.frenesia) {
        console.log('a rischio frenesia');
      } else if (this.user.PScorrenti <= this.user.cacciaobbligata) {
        console.log('in caccia obbligata');
      } 
    });

  }

  gofurto() {
    if (!this.resourceActions.tryStart()) {
      return;
    }

    this.authService.furtodivitae(this.user['idutente'])
      .pipe(finalize(() => this.resourceActions.finish()))
      .subscribe(() => {

      this.user['PScorrenti'] = this.user['PScorrenti'] + 3 > this.user['maxps'] ? this.user['maxps'] : this.user['PScorrenti'] + 3;
      this.user.puntiSangueAggiornati.next();
      
      this.FurtoVitae = 0;

      this.showalert('Patto della Vitae', 'Rigenerazione della Vitae', 4);
      this.changeDetectorRef.markForCheck();

      setTimeout(() => {
        this.FurtoVitae = 1;
        this.changeDetectorRef.markForCheck();
      }, 1800000); // 30 minuti in millisecondi 
    });
  }

  async showalert(taum: string, pot: string, livellopot: number) {
    const alert = await this.alertCtrl.create({
      header: pot,
      subHeader: taum + ' (Lvl. ' + livellopot + ')',
      //message: '[Tiro contrapposto: ' + this.esito.tiro + ']',
      buttons: ['OK'],
      cssClass: 'myalert',
    });
    alert.present();
  }
}
