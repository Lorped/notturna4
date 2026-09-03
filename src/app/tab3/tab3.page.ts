import { Component, ChangeDetectionStrategy } from '@angular/core';
import { User, Oggetto } from '../globals';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthserviceService } from '../services/authservice.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class Tab3Page {

  public barcodes: Barcode[] = [];
  public isPermissionGranted = false;

  isModalOpen = false;
  oggetto: Oggetto = new Oggetto();

  giarisposto = false;
  rispostaselezionata = '';

  oldscan: Array<Oggetto> = [];


  constructor(
    public user: User,
    public alertController: AlertController,
    private authservice: AuthserviceService
  ) {
      this.initialstuff();
  }



  async initialstuff() {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
    }

    const { available } =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();

    if (available == false) {
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


    /*******   TEST  ***/
    this.barcodes = [];
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);

    // console.log('Barcode data', barcodes);
    this.oggetto.id = this.barcodes[0].rawValue ?? '';

    if (this.oggetto.id.length > 12) {
      const newbarcode = this.oggetto.id.substr(-12);
      this.oggetto.id = newbarcode;
    }

    

    /*******
    this.oggetto.id='155405728268';
    **********/
    
    this.authservice.barcode(this.user.idutente, this.oggetto.id).subscribe((data) => {

      this.isModalOpen = true;
      
      // console.log(data);

      this.oggetto.nomeoggetto = data.nomeoggetto;
      this.oggetto.descrizione = data.descrizione;
      this.oggetto.esito = data.esito;
      this.oggetto.domanda = data.domanda;
      this.oggetto.R1 = data.R1;
      this.oggetto.R2 = data.R2;
      this.oggetto.esitoSI = data.esitoSI;
      this.oggetto.esitoNO = data.esitoNO;  

      this.giarisposto = false;
      this.rispostaselezionata = '';



    });
  }

  risposta(risposta: string) {
    //console.log('Risposta selezionata:', risposta);
    this.giarisposto = true;
    this.rispostaselezionata = risposta;
  }


  cancel() {
    this.isModalOpen = false;
    this.authservice.getscan(this.user.idutente).subscribe((data) => {
      this.oldscan = data;
    });
  }
  
  ionViewWillEnter() {
    this.authservice.getscan(this.user.idutente).subscribe((data) => {
      //console.log(data);
      this.oldscan = data;
      // console.log("odscan : ", this.oldscan);
    });
  }
}
