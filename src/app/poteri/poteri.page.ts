import { Component, OnInit } from '@angular/core';
import { User, apoteri2 } from '../globals';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-poteri',
  templateUrl: './poteri.page.html',
  styleUrls: ['./poteri.page.scss'],
})
export class PoteriPage implements OnInit {

  disc = 0 ;
  nomed = '';
  CacciaAnimalita = 0;

  mypoteri: Array<apoteri2> = [];

  constructor(public router: Router, public user: User, public activatedroute: ActivatedRoute, public http: HttpClient, public alertCtrl: AlertController) { }

  ngOnInit() {

    let tt = new Date ( this.user.fulldata['lastcaccia'] );
    let tn = new Date ( );

    let diff = tn.getTime() - tt.getTime();

    if ( diff / (60*1000) > 60 ) {
      this.CacciaAnimalita = 1 ;
    }

    
  }

	ionViewWillEnter(){

    // console.log ("poteripage..");

    this.activatedroute.paramMap.subscribe(paramMap => { 
      this.disc = Number ( paramMap.get('disc') ) ; 
      this.nomed =   paramMap.get('nomed') ! ; 
      // console.log(paramMap);
    });


    for (let i=0 ; i< this.user.poteri.length ; i++) {
      if (this.user.poteri[i].iddisciplina == this.disc) {
        this.mypoteri = this.user.poteri[i].poteri;
        // console.log(this.mypoteri);
      }
    }

  }



  gopotere(pot: string,livellopot: number) {
    // console.log(pot);
    if (pot == "Telepatia") {
      this.router.navigate(['/tabs/telepatia']);
    } else if (pot =="Richiamo" && livellopot==3)  {  //non è il richiamo di Ascendente 4
      this.cacciaanim();
    } else if ( pot =="Bacio Selvaggio") {
      var id = 1;
      this.router.navigate(['/tabs/caccia',id]);
    } else {

      var url = 'https://www.roma-by-night.it/ionicPHP/usopotere.php';
      var mypost = JSON.stringify({idutente: this.user.userid , potere: pot, livello: livellopot, aDisciplina: this.disc});
      this.http.post<any>(url, mypost)
      .subscribe(res =>  {
        //console.log(res);
        let ps=res.ps;
        //console.log(ps);
        //this.navParams.get("parentPage").loadDadi();
        this.user.fulldata['psvuoti'] = this.user.fulldata['psvuoti']+ps;
        this.user.fulldata['PScorrenti'] = this.user.fulldata['PScorrenti']-ps;

        this.showalert(pot);

        if ( this.disc == 2 && livellopot == 5) {  //MAESTA
          this.user.fulldata.nummaesta = this.user.fulldata.nummaesta - 1 ;
        }

        if (this.user.fulldata['PScorrenti']==0) {
          // VAI VIA
          this.router.navigate(['/tabs/tab5']);
        }
      });
    }
  }

  async showalert(pot: string){
    let alert =  await this.alertCtrl.create({
      header: 'Uso '+this.nomed,
      subHeader: pot,
      buttons: ['OK']
    });
    alert.present();
  }

  cacciaanim() {

    this.CacciaAnimalita = 1;
    var link = 'https://www.roma-by-night.it/ionicPHP/caccia.php?id=' + this.user['userid']+  '&recuperati=3&anim=1' ;

    this.http.get<any>(link)
    .subscribe( res => {
      this.user.fulldata['PScorrenti'] = this.user.fulldata['PScorrenti'] + 3;
      if ( this.user.fulldata['PScorrenti'] > this.user.fulldata['setetot'] ) {
        this.user.fulldata['PScorrenti'] = this.user.fulldata['setetot'] ;
      }
      this.user.fulldata['psvuoti'] = this.user.fulldata['setetot'] - this.user.fulldata['PScorrenti'];

      this.user.fulldata['lastcaccia'] = res.last;

      this.showalert('Richiamo');
      //console.log(this.myuser);
      this.router.navigate(['/tabs/tab5']);
    });


  }





}
