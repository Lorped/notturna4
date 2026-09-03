import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { User, Userskill } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { AlertController } from '@ionic/angular';

export interface EsitoPotere {
  tiro: number;
}


@Component({
  selector: 'app-taum',
  templateUrl: './taum.page.html',
  styleUrls: ['./taum.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TaumPage implements OnInit {

  FurtoVitae = 1;
  
  esito: EsitoPotere = { 
    tiro: 0
  };
  

  constructor(
    public user: User,
    public userskill: Userskill,
    public alertCtrl: AlertController,
    public authService: AuthserviceService
  ) {}

  ngOnInit() {  }

  gotaum(livellopot: number, pot: string, taum: string, idtaum2: number) {
    //console.log(pot2);
    //console.log(livellopot);

  this.authService.usonecrotaum(this.user['idutente'], pot, idtaum2,  livellopot, taum, 'T').subscribe((res) => {

    this.esito.tiro = res.tiro;

    // console.log('esito potere: ' + this.esito.tiro);


    if (livellopot == 5 ) {
      this.user.PScorrenti = this.user.PScorrenti - 2;
    } else {
      this.user.PScorrenti = this.user.PScorrenti - 1;
    }

    this.showalert(taum, pot, livellopot);

      if (this.user.PScorrenti <= this.user.frenesia) {
        console.log('a rischio frenesia');
      } else if (this.user.PScorrenti <= this.user.cacciaobbligata) {
        console.log('in caccia obbligata');
      } 
    });

  }

  gofurto() {


    this.authService.furtodivitae(this.user['idutente']).subscribe(() => {

      this.user['PScorrenti'] = this.user['PScorrenti'] + 3 > this.user['maxps'] ? this.user['maxps'] : this.user['PScorrenti'] + 3;
      
      this.FurtoVitae = 0;

      this.showalert('Patto della Vitae', 'Rigenerazione della Vitae', 4);

      setTimeout(() => {
        this.FurtoVitae = 1;
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
