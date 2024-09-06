import { Component } from '@angular/core';
import { User, Oggetto } from '../globals';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public barcodes: Barcode[] = [];
  public isPermissionGranted = false;

  rituali: number = 0;
  amalgame: number = 0;

  forza:	number = 0; //??
  rissa:	number = 0;
  mischia:	number = 0;
  lancio:	number = 0;
  tiro:		number = 0;
  fuoco:	number = 0;
  potenza:	number = 0;
  artigli:	number = 0;

  fomipot2 = 0;
  foripot2 = 0;
  folapot2 = 0;
  treti2 = 0;
  trefuoco2 = 0;

  constructor( public oggetto: Oggetto , public user: User , private router: Router, public alertController: AlertController  ) {
    
    this.initialstuff();
  }

  async initialstuff(){
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
    }
    
    let { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
 
    if (available == false ){
      // alert("debug: module not available");
      await BarcodeScanner.installGoogleBarcodeScannerModule();
    } else {
      // alert("debug: module available");
    }
    
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async openbarcode() {

    // this.oggetto.id='504756580060';
    // this.router.navigate(['/tabs/oggetto']);
    this.barcodes = [];

    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);

    // console.log('Barcode data', barcodes);
    //var ll = this.barcodes.length;
    this.oggetto.id=this.barcodes[0].rawValue;
    this.router.navigate(['/tabs/oggetto']);
 
  }

  
  ionViewWillEnter (){

    this.rituali=0;

    for (var j = 0; j < this.user.skill.length; j++) {
      if ( this.user.skill[j].tipologia==11)  {
        this.rituali=1;
        break;
      }
    }
    for (var j = 0; j < this.user.skill.length; j++) {
      if ( this.user.skill[j].tipologia==12)  {
        this.amalgame=1;
        break;
      }
    }
  

    this.rissa=0;
    this.mischia=0;
    this.lancio=0;
    this.tiro=0;
    this.fuoco=0;
    this.potenza=0;
    this.artigli=0;

    for (var i = 0; i < this.user.skill.length; i++) {
      if ( this.user.skill[i].nomeskill=="Rissa")  {
        this.rissa=this.user.skill[i].livello;
      }
      if ( this.user.skill[i].nomeskill=="Mischia")  {
        this.mischia=this.user.skill[i].livello;
      }
      if ( this.user.skill[i].nomeskill=="Armi da lancio")  {
        this.lancio=this.user.skill[i].livello;
      }
      if ( this.user.skill[i].nomeskill=="Armi da tiro")  {
        this.tiro=this.user.skill[i].livello;
      }
      if ( this.user.skill[i].nomeskill=="Armi da fuoco")  {
        this.fuoco=this.user.skill[i].livello;
      }
      if ( this.user.skill[i].nomeskill=="Potenza")  {
        this.potenza=this.user.skill[i].livello;
      }
      if ( this.user.skill[i].nomeskill=="Proteide")  {
        if (this.user.skill[i].livello >1 ) this.artigli=1;
      }
    }


    this.forza = this.user.fulldata['forza'];

  
  // console.log( "forza:" , this.forza);
  // console.log( "rissa:" , this.rissa);
  // console.log( "mischia:" , this.mischia);
  // console.log( "lancio:" , this.lancio);
  // console.log( "tiro:" , this.tiro);
  // console.log( "fuoco:" , this.fuoco);
  // console.log( "potenza:" , this.potenza);
  // console.log( "artigli:" , this.artigli);
  

    this.fomipot2 = Math.ceil((this.forza + this.mischia + this.potenza)/2);
    this.foripot2 = Math.ceil((this.forza + this.rissa + this.potenza)/2);
    this.folapot2 = Math.ceil((this.forza + this.lancio + this.potenza)/2);
    this.treti2 = Math.ceil((3 + this.tiro )/2);

    this.trefuoco2 = Math.ceil((3 + this.fuoco)/2);
  }

  





}
