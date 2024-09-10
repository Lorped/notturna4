import { Component, OnInit } from '@angular/core';
import { Amalgama, User } from '../globals';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-amalgame',
  templateUrl: './amalgame.page.html',
  styleUrls: ['./amalgame.page.scss'],
})
export class AmalgamePage implements OnInit {

  myamalgame: Array<Amalgama> = [];
  fdv = 0;
  ps = 0 ;

  constructor(public user: User,public alertCtrl: AlertController, public router: Router, public http: HttpClient) { }

  ngOnInit() {

    this.myamalgame = this.user.amalgame;

    this.fdv = this.user.fulldata.fdv;
    this.ps = this.user.fulldata.PScorrenti;


  }

  gopotere(nome: string,idamalgama: number, ps: number, fdv: number) {
    // console.log ( "nome = " , nome);
    // console.log ( "id = " , idamalgama);
    // console.log ( "ps = " , ps);
    // console.log ( "fdv = " , fdv);

    

    this.http.post<any>('https://www.roma-by-night.it/ionicPHP/usoamalgame.php', {
      idutente: this.user.userid,
      idamalgama: idamalgama
    } ).subscribe(
        (data:any) => {
          this.user.fulldata.psvuoti = this.user.fulldata.psvuoti+ps;
          this.user.fulldata.PScorrenti = this.user.fulldata.PScorrenti-ps;
          this.user.fulldata.fdv = this.user.fulldata.fdv-fdv;

          this.showalert(nome);

          if (this.user.fulldata.PScorrenti ==0 || this.user.fulldata.fdv == 0) {
            // VAI VIA
            this.router.navigate(['/tabs/tab5']);
          }

        }
    );

    

  }


  async showalert(pot: string){
    let alert =  await this.alertCtrl.create({
      header: 'Uso amalgama',
      subHeader: pot,
      buttons: ['OK']
    });
    alert.present();
  }
}
