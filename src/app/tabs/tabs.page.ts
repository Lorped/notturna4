import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { User } from '../globals';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { SessionService } from '../services/session.service';

import { addIcons } from 'ionicons';
import {
  bulbOutline,
  cellularOutline,
  contractOutline,
  flash,
  flameOutline,
  gitCompareOutline,
  globeOutline,
  keypadOutline,
  logOutOutline,
  peopleOutline,
  personOutline,
  readerOutline,
  skullOutline,
  waterOutline,
} from 'ionicons/icons';

addIcons({
  'people-outline': peopleOutline,
  flash,
  'git-compare-outline': gitCompareOutline,
  'water-outline': waterOutline,
  'reader-outline': readerOutline,
  'cellular-outline': cellularOutline,
  'flame-outline': flameOutline,
  'skull-outline': skullOutline,
  'contract-outline': contractOutline,
  'globe-outline': globeOutline,
  'log-out-outline': logOutOutline,
  'person-outline': personOutline,
  'bulb-outline': bulbOutline,
  'keypad-outline': keypadOutline,
});


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuToggle,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonTitle,
    IonToast,
    IonToggle,
    IonToolbar,
  ],
})



export class TabsPage implements OnInit {

  public router = inject(Router);
  public user = inject(User);
  public session = inject(SessionService);

  paletteToggle = false;

  ngOnInit() {
    let savedDarkMode = window.localStorage.getItem('notturnadarkmode');
    if (savedDarkMode === null) {
      savedDarkMode = 'false';
      window.localStorage.setItem('notturnadarkmode', savedDarkMode);
    }

    this.paletteToggle = savedDarkMode === 'true';
    this.toggleDarkPalette(this.paletteToggle, false);


  }
  // Check/uncheck the toggle and update the palette based on isDark
  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);


    // console.log ('Dark mode is ' + (isDark ? 'enabled' : 'disabled'));

    window.localStorage.setItem(
      'notturnadarkmode',
      isDark ? 'true' : 'false'
    );
  }

  // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(event: CustomEvent) {
    const shouldAdd = event.detail.checked;
    this.paletteToggle = shouldAdd;

    // console.log('Dark mode is ' + (shouldAdd ? 'enabled' : 'disabled'));

    this.toggleDarkPalette(shouldAdd);
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: boolean, savePreference = true) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
    document.documentElement.classList.remove('ion-palette-light');
    if (!savePreference) {
      return;
    }

        window.localStorage.setItem(
      'notturnadarkmode',
      shouldAdd ? 'true' : 'false'
    );
  }

  openRubrica() {
    this.router.navigate(['/tabs/rubrica']);
  }
  openBackground() {
    this.router.navigate(['/tabs/background']);
  }
  openPregi() {
    this.router.navigate(['/tabs/pregi']);
  }
  openMorte() {
    this.router.navigate(['/tabs/morte']);
  }
  openCaccia() {
    this.router.navigate(['/tabs/caccia']);
  }
  setOpen(isOpen: boolean) {
    this.user.ToastFineCaccia = isOpen;
  }
  openNote() {
    this.router.navigate(['/tabs/modificanote']);
  }
  openLegami() {
    this.router.navigate(['/tabs/legami']);
  }
  openFocusattr() {
    this.router.navigate(['/tabs/focusattr']);
  }
  logout() {
    void this.session.logout();
  }

  async openDT() {
    // Implementa la logica per aprire il DT
    const url = 'https://larp-oracle-1.emergent.host/'; 

    const platform = Capacitor.getPlatform();
    if (platform === 'ios' || platform === 'android') {
      await Browser.open({ 
        url: url,
        windowName: '_system'
      });
    }
    else {
      window.open(url, '_blank');
    }
  }

    async openObiettivi() {
    // Implementa la logica per aprire gli Obiettivi di Clan
    const url = this.user.linkurl;

    const platform = Capacitor.getPlatform();
    if (platform === 'ios' || platform === 'android') {
      await Browser.open({ 
        url: url,
        windowName: '_system'
      });
    }
    else {
      window.open(url, '_blank');
    }
  }

}
