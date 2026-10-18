import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { User, Oggetto } from '../globals';
import {
  Barcode,
  BarcodeScanner,
  GoogleBarcodeScannerModuleInstallState,
} from '@capacitor-mlkit/barcode-scanning';
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
  IonInput,
} from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { GooglePlayServices, Status } from '@capawesome/capacitor-google-play-services';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonCardHeader, IonCard, IonHeader, 
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
    IonInput,
  ],
})
export class Tab3Page implements OnInit {

  rispcorretta = 0;
  rispostaenigma = ''; // Risposta utente all'enigma
  numrisposte = 0; // Numero di risposte inviate all'enigma

  public barcodes: Barcode[] = [];
  public isPermissionGranted = false;
  public isScanning = false;
  public usingGoogleBarcodeScannerModule = false;
  public isCameraViewActive = false;
  private resolveCameraScan?: (barcode: Barcode | undefined) => void;
  private document = inject(DOCUMENT);

  isModalOpen = false;
  oggetto: Oggetto = new Oggetto();

  giarisposto = false;
  rispostaselezionata = '';

  oldscan: Oggetto[] = [];
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

  private async installGoogleBarcodeScannerModule(): Promise<void> {
    let resolveInstallation!: () => void;
    let rejectInstallation!: (reason: Error) => void;
    let installationCompleted = false;
    const installationFinished = new Promise<void>((resolve, reject) => {
      resolveInstallation = resolve;
      rejectInstallation = reject;
    });
    const listener: PluginListenerHandle = await BarcodeScanner.addListener(
      'googleBarcodeScannerModuleInstallProgress',
      ({ state }) => {
        if (installationCompleted) {
          return;
        }

        if (state === GoogleBarcodeScannerModuleInstallState.COMPLETED) {
          installationCompleted = true;
          resolveInstallation();
        } else if (
          state === GoogleBarcodeScannerModuleInstallState.FAILED ||
          state === GoogleBarcodeScannerModuleInstallState.CANCELED
        ) {
          installationCompleted = true;
          rejectInstallation(
            new Error(`Google Barcode Scanner module installation ${state}.`),
          );
        }
      },
    );

    try {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
      await installationFinished;
    } finally {
      await listener.remove();
    }
  }

  stopCameraScan() {
    this.resolveCameraScan?.(undefined);
  }

  private setCameraViewActive(active: boolean) {
    this.isCameraViewActive = active;
    this.document.body.classList.toggle('barcode-scanner-active', active);
    this.changeDetectorRef.markForCheck();
  }

  private async startBarcodeScan(): Promise<Barcode | undefined> {
    let rejectScan!: (reason: Error) => void;
    const scanResult = new Promise<Barcode | undefined>((resolve, reject) => {
      this.resolveCameraScan = resolve;
      rejectScan = reject;
    });
    const resolveScan = this.resolveCameraScan!;
    const listeners: PluginListenerHandle[] = [];
    let scanningStarted = false;

    try {
      listeners.push(
        await BarcodeScanner.addListener('barcodesScanned', ({ barcodes }) => {
          const [barcode] = barcodes;
          if (barcode) {
            resolveScan(barcode);
          }
        }),
      );
      listeners.push(
        await BarcodeScanner.addListener('scanError', ({ message }) => {
          rejectScan(new Error(message));
        }),
      );
      await BarcodeScanner.startScan();
      scanningStarted = true;
      this.setCameraViewActive(true);
      return await scanResult;
    } finally {
      this.resolveCameraScan = undefined;
      this.setCameraViewActive(false);
      if (scanningStarted) {
        await BarcodeScanner.stopScan();
      }
      await Promise.all(listeners.map((listener) => listener.remove()));
    }
  }

  private async presentScanErrorAlert(error: unknown): Promise<void> {
    await this.presentErrorAlert(
      'Errore durante la scansione',
      error,
      'Impossibile completare la scansione del barcode.',
    );
  }

  private async presentErrorAlert(
    header: string,
    error: unknown,
    fallbackMessage: string,
  ): Promise<void> {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof error.message === 'string'
          ? error.message
          : String(error);
    const alert = await this.alertController.create({
      header,
      message: message || fallbackMessage,
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
      this.usingGoogleBarcodeScannerModule = available;

      if (!available) {
        const { status } = await GooglePlayServices.getStatus();

        if (status !== Status.Success) {
          try {
            await GooglePlayServices.makeAvailable();
          } catch (error) {
            console.error('Errore durante l’attivazione di Google Play Services', error);
            await this.presentErrorAlert(
              'Google Play Services non disponibili',
              error,
              'Impossibile attivare Google Play Services su questo dispositivo.',
            );
            return;
          }
        }



        try {
          await this.installGoogleBarcodeScannerModule();
          this.usingGoogleBarcodeScannerModule = true;
        } catch (error) {
          console.error('Errore durante l’installazione del modulo barcode', error);
          this.usingGoogleBarcodeScannerModule = false;
        }
      }

      // this.usingGoogleBarcodeScannerModule = false; // SOLO PER TEST!!

      let barcode: Barcode | undefined;
      try {
        barcode = this.usingGoogleBarcodeScannerModule
          ? (await BarcodeScanner.scan()).barcodes[0]
          : await this.startBarcodeScan();
      } catch (error) {
        console.error('Errore durante la scansione del barcode', error);
        await this.presentScanErrorAlert(error);
        return;
      }
      this.barcodes = barcode ? [barcode] : [];
      if (!barcode) {
        return;
      }

      this.oggetto.id = barcode.rawValue ?? '';
      if (this.oggetto.id.length > 12) {
        this.oggetto.id = this.oggetto.id.slice(-12);
      }

      const data = await firstValueFrom(
        this.authservice.barcode(this.user.idutente, this.oggetto.id)
      );

      this.oggetto.idoggetto = data.idoggetto;
      this.oggetto.nomeoggetto = data.nomeoggetto;
      this.oggetto.descrizione = data.descrizione;
      this.oggetto.esito = data.esito;
      this.oggetto.domanda = data.domanda;
      this.oggetto.R1 = data.R1;
      this.oggetto.R2 = data.R2;
      this.oggetto.esitoSI = data.esitoSI;
      this.oggetto.esitoNO = data.esitoNO;
      this.oggetto.premio = data.premio;
      this.oggetto.soluzione = data.soluzione;
      this.oggetto.enigma = data.enigma;
      this.giarisposto = false;
      this.rispostaselezionata = '';
      this.hasNewScan = true;
      this.isModalOpen = true;

      this.numrisposte = 0; // Reset the number of attempts for the new scan
      this.rispcorretta = 0; // Reset the correctness of the enigma response for the new scan
      this.rispostaenigma = ''; // Reset the enigma response for the new scan

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
    this.authservice.getscan(this.user.idutente).subscribe((data: Oggetto[]) => {
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

  async RispostaEnigma() {
    // Logica per gestire la risposta all'enigma
    console.log('Risposta all\'enigma:', this.rispostaenigma);
    if ( this.rispostaenigma.trim().toUpperCase() === this.oggetto.soluzione.trim().toUpperCase()) {
      
      await this.authservice.writeenigma(this.user.idutente, this.oggetto.idoggetto).subscribe();
      this.rispcorretta = 1; // Risposta corretta sblocco enigma su frontend
      this.authservice.msgtomaster(this.user.idutente,'Risolto enigma ' + this.oggetto.nomeoggetto).subscribe();

      
    } else {
      this.rispcorretta = 0; // Risposta errata
      this.numrisposte++;
      if (this.numrisposte >= 10) {
        //this.rispcorretta = -1; // Blocco dopo 10 tentativi
        this.authservice.msgtomaster(this.user.idutente,'Tentativi esauriti per enigma ' + this.oggetto.nomeoggetto).subscribe();
        this.cancel();
      }
    }
  }
}
