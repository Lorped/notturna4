import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { User, Userskill } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { ResourceActionService } from '../services/resource-action.service';

export interface EsitoPotere {
  tiro: number;
}

@Component({
  selector: 'app-necro',
  templateUrl: './necro.page.html',
  styleUrls: ['./necro.page.scss'],
  standalone: false,
})
export class NecroPage {
  
  esito: EsitoPotere = { 
    tiro: 0
  };

  public user = inject(User);
  public userskill = inject(Userskill);
  public alertCtrl = inject(AlertController);
  public authService = inject(AuthserviceService);
  public resourceActions = inject(ResourceActionService);
  private changeDetectorRef = inject(ChangeDetectorRef);


  // constructor removed as inject() is used instead



  gonecro(livellopot: number, pot: string, necro: string, idnecro2: number) {
    if (!this.resourceActions.tryStart()) {
      return;
    }

    this.authService.usonecrotaum(this.user['idutente'], pot, idnecro2,  livellopot, necro, 'N')
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

    this.showalert(necro, pot, livellopot);
    this.changeDetectorRef.markForCheck();

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
