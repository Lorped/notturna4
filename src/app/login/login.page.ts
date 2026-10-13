import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonLoading,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { User , Userskill} from '../globals';
import { AuthserviceService } from '../services/authservice.service';

import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Keyboard } from '@capacitor/keyboard';
import type { PluginListenerHandle } from '@capacitor/core';
import { FCM } from '@capacitor-community/fcm';



import { PushNotifications, Token } from '@capacitor/push-notifications';
import { MenopsRoutineService } from '../services/menops-routine.service';

import type { GetSkill, GetTaum, Clan } from '../services/authservice.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonCheckbox,
    IonCol,
    IonContent,
    IonHeader,
    IonInput,
    IonInputPasswordToggle,
    IonItem,
    IonList,
    IonLoading,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class LoginPage implements OnInit, OnDestroy {
  private readonly content = viewChild.required(IonContent, { read: ElementRef });
  private keyboardListeners: Promise<PluginListenerHandle>[] = [];
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  username = '';
  userid = 0;

  listaclan: Clan[] = [];

  isDarkMode = false;

  saveme = {
    checked: false,
  };
  registerCredentials = { username: '', password: '' };

  private router = inject(Router);
  private authentication = inject(AuthserviceService);
  public user = inject(User);
  public userskill = inject(Userskill);
  private loadingCtrl = inject(LoadingController);
  private menopsRoutine = inject(MenopsRoutineService);

  constructor() {
    this.registerCredentials.username =
      window.localStorage.getItem('notturnauserid')!;
    this.registerCredentials.password =
      window.localStorage.getItem('notturnapasswd')!;
    if (this.registerCredentials.username != '') {
      this.saveme.checked = true;
    }
  }

  ngOnInit() {
    this.applyAppPalette();
    this.keyboardListeners = [
      Keyboard.addListener('keyboardWillShow', (info) =>
        this.setKeyboardOffset(info.keyboardHeight)
      ),
      Keyboard.addListener('keyboardWillHide', () => this.setKeyboardOffset(0)),
    ];
  }

  ngOnDestroy() {
    this.keyboardListeners.forEach((l) => l.then((h) => h.remove()));
  }

  // Con edge-to-edge la WebView non si ridimensiona: lasciamo spazio alla tastiera
  private setKeyboardOffset(height: number) {
    const el = this.content().nativeElement as HTMLElement;
    el.style.setProperty('--keyboard-offset', `${height}px`);
    if (height > 0) {
      setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        active?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
  }
  
  private applyAppPalette() {
    let savedDarkMode = window.localStorage.getItem('notturnadarkmode');
    if (savedDarkMode === null) {
      savedDarkMode = 'false';
      window.localStorage.setItem('notturnadarkmode', savedDarkMode);
    }

    this.isDarkMode = savedDarkMode === 'true';
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);
    document.documentElement.classList.remove('ion-palette-light');
    this.changeDetectorRef.markForCheck();
  }

  public login() {
    // console.log( this.registerCredentials.username );
    // console.log( this.registerCredentials.password );

    this.authentication.login(this.registerCredentials.username,this.registerCredentials.password).subscribe(
      (data: User) => {
        //save if required
        if (this.saveme.checked == true) {
          window.localStorage.setItem(
            'notturnauserid',
            this.registerCredentials.username
          );
          window.localStorage.setItem(
            'notturnapasswd',
            this.registerCredentials.password
          );
        } else {
          window.localStorage.removeItem('notturnauserid');
          window.localStorage.removeItem('notturnapasswd');
        }


        //this.user = data;
        Object.assign(this.user, data);

        this.menopsRoutine.riconciliaAlLogin(this.user);

        if (this.user.idlds == 21 ) {
          // this.user.bonusdisc = Number (this.user.bonusdisc) + 1;
          this.user.bonusdisc = this.user.bonusdisc + 1;
        }


        this.authentication.skill(this.user.idutente).subscribe(
          (data: GetSkill) => {
            this.userskill.skill = data.skill;
            this.userskill.otherskill = data.otherskill;
            this.userskill.discipline = data.discipline;
            this.userskill.background = data.background;
            this.userskill.alleati = data.alleati;
            this.userskill.contatti = data.contatti;

            this.user.pf = (3 + this.user['attutimento']) * 2;
            console.log("PF calcolato: ", this.user.pf);

            this.user.rp = Math.floor(this.user['attutimento'] / 2 );

            /*
            for (let i = 0; i < this.userskill.skill.length; i++) {
              this.userskill.skill[i].livello = Number(this.userskill.skill[i].livello);
            }
            */
            for (const skill of this.userskill.otherskill) {
              // skill.livello = Number(skill.livello);
              if (skill.idskill == 47) {  //schivare
                this.user.pf += skill.livello;
              }
            }

            const rob = this.userskill.discipline.find ( xx => xx.iddisciplina == 12 ); //robustezza

            if ( rob ) {
              // rob.livello = Number(rob.livello);
              this.user.pf += rob.livello;
              this.user.rp = Math.floor( (this.user['attutimento'] + rob.livello) / 2 );

              for (const potere of rob.poteri) {
                if (potere.idpotere == 70 ) { 
                  // if (rob.focus > 0 ) { this.user.pf += Number(this.user.bonusdisc); }
                  if (rob.focus > 0 ) { this.user.pf += this.user.bonusdisc; }
                  this.user.pf += (5+rob.livello);
                }
                if (potere.idpotere == 74 ) { this.user.pf += 5;} //+5 sono nel potere precedente - che è prerequisito. focus contato una sola volta: la prima
              }
            }

            this.user['rd'] = Math.floor(
              (this.user['carisma'] +
                this.user['intelligenza'] +
                this.user['prontezza'] +
                this.user['percezione'] +
                this.user['fdv']) /
                5
            );

            this.authentication.taum(this.user.idutente).subscribe(
              (data: GetTaum) => {
                this.userskill.taum = data.taum;
                this.userskill.necro = data.necro;
                this.userskill.rituali = data.rituali;
            });


            // all done
            this.loadingCtrl.dismiss();

            void this.pushsetup();

            //console.log ("user ", this.user);
            //console.log ("userskill ", this.userskill);

            this.router.navigate(['tabs']);
        },
          (error) => {
            this.loadingCtrl.dismiss();
            alert('Error loading data4');  //SKILL
            console.log('error', error);
          }
        );
    },
        (error) => {
          this.loadingCtrl.dismiss();
          //console.log(error);
          switch (error['status']) {
            case 401:
              alert('Non autorizzato');
              break;
            case 404:
              alert('Scheda non trovata');
              break;
            default:
              alert('Server error');
          }
          // console.log('error');
        }
      );
  }


  async pushsetup() {
    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') {
        console.warn('Push permission not granted');
        return;
      }

      await PushNotifications.createChannel({
        name: 'Notturna Channel',
        id: 'PushPluginChannel',
        description: 'Notturna Channel',
        importance: 5,
        sound: 'notturna_sound',
      });

      let registrationListener: { remove: () => void } | undefined;
      let registrationErrorListener: { remove: () => void } | undefined;

      const token = await new Promise<Token>((resolve, reject) => {
        PushNotifications.addListener('registration', (t: Token) => {
          registrationListener?.remove();
          registrationErrorListener?.remove();
          resolve(t);
        }).then((listener) => {
          registrationListener = listener;
        });

        PushNotifications.addListener('registrationError', (error) => {
          registrationListener?.remove();
          registrationErrorListener?.remove();
          reject(error);
        }).then((listener) => {
          registrationErrorListener = listener;
        });

        PushNotifications.register();
      });

      await firstValueFrom(
        this.authentication.updateid(this.user.idutente, token.value)
      );

      await FCM.subscribeTo({ topic: 'user' })
        .then(() => console.log('subscribed to topic: user'))
        .catch((err) => console.error('Error subscribing to user topic', err));

      const data = await firstValueFrom(this.authentication.clan());
      this.listaclan = data ?? [];

      await Promise.all(
        this.listaclan
          //.filter((element) => Number(element.idclan) !== Number(this.user.idclan))
          .filter((element) => element.idclan !== this.user.idclan)
          .map((element) =>
            FCM.unsubscribeFrom({ topic: element.nomeclan }).catch(() => undefined)
          )
      );

      const clanTopic = this.user.nomeclan;
      await FCM.subscribeTo({ topic: clanTopic })
        .then(() => console.log('subscribed to topic:', clanTopic))
        .catch((err) => console.error('Error subscribing to clan topic', err));

      PushNotifications.addListener('pushNotificationReceived', () => {
        //alert('Push received');
      });

      PushNotifications.addListener('pushNotificationActionPerformed', () => {
        //alert('Push action performed');
      });

    } catch (error) {
      console.error('Push registration failed', error);
    }
  }


  ionViewWillEnter() {
    this.applyAppPalette();
    // console.log('Dark mode is ' + (this.isDarkMode ? 'enabled' : 'disabled'));
  }
}
