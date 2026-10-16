import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonAccordion,
  IonAccordionGroup,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { User, Userskill } from '../globals';
import { TimesPipe } from '../pipes/times.pipe';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    TimesPipe,
    IonAccordion,
    IonAccordionGroup,
    IonButtons,
    IonCol,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonRow,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {

  forza = 0; 
  rissa = 0;
  mischia = 0;
  lancio = 0;
  tiro = 0;
  fuoco = 0;
  potenza = 0;
  artigli = 0;

  fomipot2 = 0;  
  foripot2 = 0;
  folapot2 = 0;
  treti2 = 0;
  trefuoco2 = 0;

  public user = inject(User);
  public userskill = inject(Userskill);

  ngOnInit() {

    this.rissa = 0;
    this.mischia = 0;
    this.lancio = 0;
    this.tiro = 0;
    this.fuoco = 0;
    this.potenza = 0;
    this.artigli = 0;


    for (const skill of this.userskill.otherskill) {
      if (skill.idskill == 42) {  //rissa
        //this.rissa = Number(skill.livello);
        this.rissa = skill.livello;
      }
      if (skill.idskill == 43) {  //mischia
        this.mischia = skill.livello;
      }
      if (skill.idskill == 46) {  //lancio
        this.lancio = skill.livello;
      }
      if (skill.idskill == 45) {  //Armi da tiro
        this.tiro = skill.livello;
      }
      if (skill.idskill == 44) {  //Armi da fuoco
        this.fuoco = skill.livello;
      }
    }
    const pot = this.userskill.discipline.find((xx) => xx.iddisciplina == 17); //potenza
    if (pot) {
      this.potenza = pot.livello;
    }
    const prot = this.userskill.discipline.find((xx) => xx.iddisciplina == 18); //proteide
    if (prot && prot.livello > 2) {
      this.artigli = 1;
    }  

    this.forza = this.user['forza'];

    // console.log( "forza:" , this.forza);
    // console.log( "rissa:" , this.rissa);
    // console.log( "mischia:" , this.mischia);
    //console.log( "lancio:" , this.lancio);
    //console.log( "tiro:" , this.tiro);
    //console.log( "fuoco:" , this.fuoco);
    //console.log( "potenza:" , this.potenza);
    //console.log( "artigli:" , this.artigli);

    this.fomipot2 = Math.ceil((this.forza + this.mischia + this.potenza) / 2);
    this.foripot2 = Math.ceil((this.forza + this.rissa + this.potenza) / 2);

    this.folapot2 = Math.ceil((this.forza + this.lancio + this.potenza) / 2);
    this.treti2 = Math.ceil((3 + this.tiro) / 2);

    this.trefuoco2 = Math.ceil((3 + this.fuoco) / 2);

    //console.log( "fomipot2:" , this.fomipot2);
    //console.log( "foripot2:" , this.foripot2);
    //console.log( "folapot2:" , this.folapot2);
    //console.log( "treti2:" , this.treti2);
    //console.log( "trefuoco2:" , this.trefuoco2);
  }
}
