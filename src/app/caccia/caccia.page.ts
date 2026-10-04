import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { pregiodifetto, User, Userskill } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { IonRow, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,  IonMenuButton,  IonItem,   IonButton, IonText, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-caccia',
  templateUrl: './caccia.page.html',
  styleUrls: ['./caccia.page.scss'],
  imports: [ IonRow, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,  IonMenuButton, IonItem,  IonButton, IonText, IonLabel], 
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

  public user = inject(User);
  public userskill = inject(Userskill);
  private authservice = inject(AuthserviceService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.user.puntiSangueAggiornati
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }

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
        this.bs = window.localStorage.getItem('NotturnaCacciaBs') === '1' ? 1 : 0;
        const mod = JSON.parse(
          window.localStorage.getItem('NotturnaCacciaMod') ?? '{}',
        ) as Partial<Record<'metab' | 'zanne' | 'organovoro' | 'gregge', number>>;
        this.metab = mod.metab ?? 0;
        this.zanne = mod.zanne ?? 0;
        this.organovoro = mod.organovoro ?? 0;
        this.gregge = mod.gregge ?? 0;

        //console.log('inizio caccia: ' + this.timestart);
        //console.log('durata caccia: ' + this.duratacaccia);
        this.updateDisplay(Math.round((new Date().getTime() - this.timestart) / 1000));
        this.StartTimer();
        this.cdr.markForCheck();
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
      window.localStorage.setItem('NotturnaCacciaBs', this.bs.toString());
      window.localStorage.setItem(
        'NotturnaCacciaMod',
        JSON.stringify({
          metab: this.metab,
          zanne: this.zanne,
          organovoro: this.organovoro,
          gregge: this.gregge,
        }),
      );


      //console.log('inizio caccia: ' + this.timestart);
      //console.log('durata caccia: ' + this.duratacaccia);

      this.authservice.msgtomaster(this.user['idutente'], 'ha iniziato la caccia').subscribe();

      this.StartTimer();
      this.cdr.markForCheck();

    });
  }

  private updateDisplay(elapsedSeconds: number) {
    const rimasti = Math.max(0, this.duratacaccia - elapsedSeconds);
    this.minuti = Math.floor(rimasti / 60);
    this.secondi = rimasti % 60;
    this.secondi_string = this.secondi.toString().padStart(2, '0');
    this.min_string = this.minuti.toString().padStart(2, '0');
  }

  StartTimer() {
    setTimeout(() => {
      
      const now = new Date();
      const nowt = now.getTime();

      //secondi trascorsi dall'inizio della caccia
      const elapsedSeconds = Math.round((nowt - this.timestart) / 1000);

      this.updateDisplay(elapsedSeconds);

      if (elapsedSeconds < this.duratacaccia ) {
        if (this.statocaccia == -1) { // cancellata la caccia
          console.log("caccia cancellata");
          this.statocaccia = 0;
          this.user.incaccia = 0;
          this.bs = 0 ;
          window.localStorage.removeItem('NotturnaCacciaTimestart');
          window.localStorage.removeItem('NotturnaDurataCaccia');
          window.localStorage.removeItem('NotturnaCacciaBs');
          window.localStorage.removeItem('NotturnaCacciaMod');
        } else {
          //console.log("è passato un secondo, non ho finito, rilancio il timer");
          //console.log ('tempo trascorso: ' + elapsedSeconds + ' secondi');
          this.statocaccia = 1;
          this.user.incaccia = 1;
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
        window.localStorage.removeItem('NotturnaCacciaBs');
        window.localStorage.removeItem('NotturnaCacciaMod');
        this.msgfine();
      }
      this.cdr.markForCheck();
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
    this.user.puntiSangueAggiornati.next();

    this.authservice.caccia(this.user['idutente'], this.bs).subscribe();

    this.authservice.msgtomaster(this.user['idutente'], 'ha terminato la caccia').subscribe();

  }


}
