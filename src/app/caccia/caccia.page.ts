import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { pregiodifetto, User, Userskill } from '../globals';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-caccia',
  templateUrl: './caccia.page.html',
  styleUrls: ['./caccia.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CacciaPage implements OnInit {
  duratacaccia = 600; /* base 10 minuti */
  minuti = 10;
  secondi = 0;
  min_string = '10';
  secondi_string = '00';

  statocaccia = 0;  //   0 - prima , 1 - in corso, 2 - finita



  metab = 0;  // metab. effic  -3 min
  zanne = 0; // zanne spuntate +2 min
  gregge = 0; // -1 min / livello
  bs = 0; // bacio selvaggio -50%
  organovoro = 0; // organo voro +2 min
  bspossibile = 0; // bacio selvaggio possibile

  pregi: Array<pregiodifetto> = [];

  timestart = 0;

  constructor(
    public user: User,
    public userskill: Userskill,
    public authservice: AuthserviceService,
  ) {}

  ngOnInit() {
    const pot = this.userskill.discipline.find((d) => d.iddisciplina == 17);  // potenza
    if (pot) {
      const bb = pot.poteri.find((p) => p.idpotere == 54); // bacio selvaggio
      if (bb) {
        this.bspossibile = 1;
      }
    }
  }

  ionViewWillEnter() {
   
      const oldstart = window.localStorage.getItem(
        'NotturnaCacciaTimestart',
      );
      const olddurata = window.localStorage.getItem(
        'NotturnaDurataCaccia',
      );

      if (olddurata && oldstart && this.user.incaccia == 0) {
        console.log ('riprendo la caccia in corso');
        this.statocaccia = 1;
        this.user.incaccia = 1;
        this.timestart = parseInt(oldstart);
        this.duratacaccia = parseInt(olddurata);

        //console.log('inizio caccia: ' + this.timestart);
        //console.log('durata caccia: ' + this.duratacaccia);
        const ttn = new Date();
        const nowt = ttn.getTime();
        const elapsedSeconds = Math.round((nowt - this.timestart) / 1000);
        //console.log('tempo trascorso: ' + elapsedSeconds + ' secondi'); 
        this.duratacaccia = this.duratacaccia - elapsedSeconds;
        //console.log('nuovo tempo rimanente: ' + this.duratacaccia + ' secondi');

        this.StartTimer();
      }
  }

  iniziocaccia_bs(){
    this.bs = 1;
    this.iniziocaccia();
  }

  iniziocaccia() {
    this.user.incaccia = 1;

    const gg = this.userskill.background.find((b) => b.idback == 11);
    if (gg) {
      this.gregge = gg.livello;
    }

    this.authservice.getpregi(this.user.idutente).subscribe((data) => {
      Object.assign(this.pregi, data);

      const metab = this.pregi.find((p) => p.idpregio == 5);
      if (metab) {
        this.metab = 3;
      }
      const zanne = this.pregi.find((p) => p.idpregio == 17);
      if (zanne) {
        this.zanne = 2;
      }

      if(this.user.idlds ==  24) {  // GALAN
        this.organovoro = 2 ;
      }

      //valore in secondi della caccia
      this.duratacaccia = (this.user.tempocaccia - this.gregge  - this.metab  + this.zanne + this.organovoro)*60;

      if (this.bs == 1) {
        this.duratacaccia = Math.round(this.duratacaccia / 2);
      } 


      // TEMPO RIDOTTO PER TEST!!!
      // this.duratacaccia = 120;  // 2 minuti per test
      /***************************** */

      //scrivo in locale il tempo di caccia
      window.localStorage.setItem(
        'NotturnaDurataCaccia',
        this.duratacaccia.toString()
      );
      const tn = new Date();
      this.timestart = tn.getTime();
      window.localStorage.setItem(
        'NotturnaCacciaTimestart',
        this.timestart.toString()
      );


      //console.log('inizio caccia: ' + this.timestart);
      //console.log('durata caccia: ' + this.duratacaccia);

      this.authservice.msgtomaster(this.user['idutente'], 'ha iniziato la caccia').subscribe();

      this.StartTimer();

    });
  }

  scrivilocale(restanti: number) {
      //scrivo in locale l'ora d'inizio della caccia
      const tn = new Date();
      const ttn = tn.getTime();
      window.localStorage.setItem(
        'NotturnaCacciaTimestart',
        ttn.toString()
      );
      //scrivo in locale i secondi restanti
      window.localStorage.setItem(
        'NotturnaDurataCaccia',
        restanti.toString()
      );

  }

  StartTimer() {
    setTimeout(() => {
      
      const now = new Date();
      const nowt = now.getTime();

      //secondi trascorsi dall'inizio della caccia
      const elapsedSeconds = Math.round((nowt - this.timestart) / 1000);

      this.minuti = Math.floor( (this.duratacaccia - elapsedSeconds) / 60 );
      this.secondi = (this.duratacaccia - elapsedSeconds)  - (this.minuti * 60);

      //console.log('tempo trascorso: ' + elapsedSeconds + ' secondi');
      //console.log('tempo rimanente: ' + this.minuti + ' minuti e ' + this.secondi + ' secondi');

      if (this.secondi < 10) {
        this.secondi_string = '0' + this.secondi.toString();
      } else {
        this.secondi_string = this.secondi.toString();
      }
      if (this.minuti < 10) {
        this.min_string = '0' + this.minuti.toString();
      } else {
        this.min_string = this.minuti.toString();
      }

      if (elapsedSeconds < this.duratacaccia ) {
        if (this.statocaccia == -1) { // cancellata la caccia
          console.log("caccia cancellata");
          this.statocaccia = 0;
          this.user.incaccia = 0;
          this.bs = 0 ;
          window.localStorage.removeItem('NotturnaCacciaTimestart');
          window.localStorage.removeItem('NotturnaDurataCaccia');
        } else {
          //console.log("è passato un secondo, non ho finito, rilancio il timer");
          //console.log ('tempo trascorso: ' + elapsedSeconds + ' secondi');
          this.statocaccia = 1;
          this.user.incaccia = 1;
          this.scrivilocale(this.duratacaccia-elapsedSeconds);
          this.StartTimer();
        }
      } else {
        // HO FINITO LA CACCIA!!!
        this.statocaccia = 2;
        this.user.incaccia = 0;
        this.bs = 0 ;
        console.log("FINE");
        this.user.ToastFineCaccia = true;
        window.localStorage.removeItem('NotturnaCacciaTimestart');
        window.localStorage.removeItem('NotturnaDurataCaccia');
        this.msgfine();
      }
    }, 1000);
  }


  cancellacaccia() {
    this.statocaccia = -1;
    this.user.incaccia = 0;
  }



  msgfine() {

    this.user.incaccia = 0;
    this.statocaccia = 2;

    this.user['PScorrenti'] = this.user['maxps'];

    this.authservice.caccia(this.user['idutente'], this.bs).subscribe();

    this.authservice.msgtomaster(this.user['idutente'], 'ha terminato la caccia').subscribe();

  }


}
