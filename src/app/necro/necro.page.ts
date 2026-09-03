import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { User, Userskill } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { AlertController } from '@ionic/angular';

export interface EsitoPotere {
  tiro: number;
}

@Component({
  selector: 'app-necro',
  templateUrl: './necro.page.html',
  styleUrls: ['./necro.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NecroPage implements OnInit {
  
  esito: EsitoPotere = { 
    tiro: 0
  };


  constructor(
    public user: User,
    public userskill: Userskill,
    public alertCtrl: AlertController,
    public authService: AuthserviceService
  ) {}

  ngOnInit() {}

  gonecro(livellopot: number, pot: string, necro: string, idnecro2: number) {

    this.authService.usonecrotaum(this.user['idutente'], pot, idnecro2,  livellopot, necro, 'N').subscribe((res) => {

    this.esito.tiro = res.tiro;

    // console.log('esito potere: ' + this.esito.tiro);


    if (livellopot == 5 ) {
      this.user.PScorrenti = this.user.PScorrenti - 2;
    } else {
      this.user.PScorrenti = this.user.PScorrenti - 1;
    }

    this.showalert(necro, pot, livellopot);

      if (this.user.PScorrenti <= this.user.frenesia) {
        // console.log('a rischio frenesia');
      } else if (this.user.PScorrenti <= this.user.cacciaobbligata) {
        // console.log('in caccia obbligata');
      } 
    });

  }


  async showalert(necro: string, pot: string, livellopot: number) {
    const alert = await this.alertCtrl.create({
      header: pot,
      subHeader: necro + ' (Lvl. ' + livellopot + ')',
      //message: '[Tiro contrapposto: ' + this.esito.tiro + ']',
      buttons: ['OK'],
      cssClass: 'myalert',
    });
    alert.present();
  }
}
