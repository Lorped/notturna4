import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, Oggetto } from '../globals';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthserviceService } from '../services/authservice.service';
import { MenopsRoutineService } from '../services/menops-routine.service';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonModal,
    IonRow,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab3Page implements OnInit {

  public barcodes: Barcode[] = [];
  public isPermissionGranted = false;
  public isScanning = false;

  isModalOpen = false;
  oggetto: Oggetto = new Oggetto();

  giarisposto = false;
  rispostaselezionata = '';

  oldscan: Array<Oggetto> = [];
  private oldscanLoaded = false;
  private hasNewScan = false;

  public authservice = inject(AuthserviceService);
  public user = inject(User);
  public alertController = inject(AlertController);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private menopsRoutine = inject(MenopsRoutineService);

  ngOnInit() {
    this.menopsRoutine.ripristina(this.user);
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
    if (this.isScanning) {
      return;
    }

    this.isScanning = true;
    this.isPermissionGranted = false;
    this.changeDetectorRef.markForCheck();

    try {
      this.isPermissionGranted = await this.requestPermissions();
      if (!this.isPermissionGranted) {
        await this.presentAlert();
        return;
      }

      const { available } =
        await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (!available) {
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }

      const { barcodes } = await BarcodeScanner.scan();
      this.barcodes = barcodes;
      if (barcodes.length === 0) {
        return;
      }

      this.oggetto.id = barcodes[0].rawValue ?? '';
      if (this.oggetto.id.length > 12) {
        this.oggetto.id = this.oggetto.id.slice(-12);
      }

      const data = await firstValueFrom(
        this.authservice.barcode(this.user.idutente, this.oggetto.id)
      );

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
      this.hasNewScan = true;
      this.isModalOpen = true;

      if (data.nomeoggetto === 'SEGRETERIA' && this.user.idlds === 17) {
        this.menopsRoutine.avvia(this.user);
      }
    } catch (error) {
      console.error('Errore durante la scansione del barcode', error);
    } finally {
      this.isScanning = false;
      this.changeDetectorRef.markForCheck();
    }

  }

  risposta(risposta: string) {
    //console.log('Risposta selezionata:', risposta);
    this.giarisposto = true;
    this.rispostaselezionata = risposta;
  }


  cancel() {
    this.isModalOpen = false;
    if (!this.hasNewScan) {
      return;
    }

    this.hasNewScan = false;
    this.loadOldScan();
  }

  private loadOldScan() {
    this.authservice.getscan(this.user.idutente).subscribe((data) => {
      this.oldscan = data;
      this.changeDetectorRef.markForCheck();
    });
  }
  
  ionViewWillEnter() {
    if (!this.oldscanLoaded) {
      this.oldscanLoaded = true;
      this.loadOldScan();
    }
  }
}
