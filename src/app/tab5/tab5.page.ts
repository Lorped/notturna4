import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { pregiodifetto, User, Userskill } from '../globals';
import { FeedService, FeedItem } from '../services/feed.service';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';


export interface EsitoResistenza {
  tiro: number;
}


@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class Tab5Page implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;


  alertButtons = ['OK'];
  tiridado: Array<FeedItem>;

  isResist1Open = false;
  isResist2Open = false;
  esito = 0;


  messaggioArbitro = '';
  isModalOpen = false;
  isToastOpen = false;

  messaggioToast = '';
  
  listapregi: Array<pregiodifetto> = [];
  voldeb = false;  //volontà debole


  constructor(
    public user: User,
    public userskill: Userskill,
    public feed: FeedService,
    public router: Router,
    public authservice: AuthserviceService
  ) {
    this.tiridado = [];
    this.loadDadi();
  }

  ngOnInit() {
    this.authservice.getpregi(this.user.idutente).subscribe((data: Array<pregiodifetto>) => {
      this.listapregi = Array.isArray(data) ? [...data] : [];

      const voldeb = this.listapregi.some(p => Number(p.idpregio) == 27); // volontà debole  
      if (voldeb) {
        this.voldeb = true;
      }
      //console.log('Pregi e difetti:', this.listapregi);
    });
  }

  /*
  handleRefresh() {
    setTimeout(() => {
      this.loadDadi();     
    }, 2000);
  }
  */

  loadDadi() {
    this.feed.getDadi(this.user['idutente']).subscribe((res: FeedItem[] | null) => {
      this.tiridado = res ?? [];
    });
  }

  tiraildado() {
    this.authservice.lanciadado(this.user['idutente']).subscribe(() => {
      setTimeout(() => this.loadDadi(), 1000);
    });
  }

  usafdv() {
    this.authservice.usofdv(this.user['idutente']).subscribe(() => {
      setTimeout(() => this.loadDadi(), 1000);
    });

    this.user['fdv']--;
    this.user['rd'] = Math.floor(
      (this.user['carisma'] +
        this.user['intelligenza'] +
        this.user['prontezza'] +
        this.user['percezione'] +
        this.user['fdv']) /
        5
    );
  }

  menops() {
    this.authservice.menops(this.user['idutente']).subscribe(() => {
      this.user.PScorrenti--;
      this.checkToast();

      setTimeout(() => this.loadDadi(), 1000);
    });
  }


  resistidisc(){

    this.authservice.tiroresistenza(this.user['idutente'], 0).subscribe((res: EsitoResistenza) => {
      this.esito = res.tiro;
      this.isResist1Open = true;
      this.authservice.msgtomaster(this.user['idutente'], 'Tiro di resistenza a Disciplina: ' + this.esito ).subscribe(() => {
        setTimeout(() => this.loadDadi(), 1000);
        });
    });
  }

  resistidisc2(){
    this.authservice.tiroresistenza(this.user['idutente'], this.user.rd).subscribe((res: EsitoResistenza) => {
      this.esito = res.tiro;
      this.isResist2Open = true;
      this.authservice.msgtomaster(this.user['idutente'], 'Tiro di resistenza a Dominazione: ' + this.esito ).subscribe(() => {
        setTimeout(() => this.loadDadi(), 1000);
        });
    });
  }
    

  togglealert(isOpen: boolean) {
    this.isResist1Open = isOpen;
    this.isResist2Open = isOpen;
  }
 

  godisciplina(disc: number, nomed: string) {
    if (disc == 98) {
      // go TAUM
      this.router.navigate(['/tabs/taum']);
    } else if (disc == 99) {
      // go NECRO
      this.router.navigate(['/tabs/necro']);
    } else {
      // go GENERICO
      this.router.navigate(['/tabs/poteri', disc, nomed]);
    }
  }


  mandaArbitro() {

    // console.log('Arbitro in Nero');
    // console.log('Messaggio da inviare: ', this.messaggioArbitro);
    this.messaggioArbitro = this.messaggioArbitro.trim(); // Rimuove spazi bianchi iniziali e finali

    this.messaggioArbitro = "Richiesta di intervento da parte di un Arbitro in Nero. " + this.messaggioArbitro;

    this.authservice.msgtomaster(this.user.idutente, this.messaggioArbitro).subscribe(() => {
      // console.log('Messaggio inviato con successo');
      // this.messaggioArbitro = ''; // Pulisce il campo di input dopo l'invio
      this.setOpen(false); // Chiude il modal dopo l'invio
    }, error => {
      this.setOpen(false); // Chiude il modal dopo l'invio
      console.error('Errore durante invio messaggio', error);
    }); 
  }

  ionViewWillEnter() {
    this.tiridado = [];
    this.loadDadi();
    this.checkToast();
  }

  setOpen(isOpen: boolean) {
    this.messaggioArbitro = '';
    this.isModalOpen = isOpen;
  }
  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  checkToast() {
    this.isToastOpen = false;
    if (this.user.PScorrenti <= this.user.frenesia) {
        //console.log('a rischio frenesia');
        this.messaggioToast = 'Attenzione! Sei a rischio frenesia!!';
        this.setToastOpen(true);
    } else if (this.user.PScorrenti <= this.user.cacciaobbligata) {
        //console.log('in caccia obbligata');
        this.messaggioToast = 'Attenzione! Devi andare a Caccia al più presto!!';
        this.setToastOpen(true);
    } 
  }

}
