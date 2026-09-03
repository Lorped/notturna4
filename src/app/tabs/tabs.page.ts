import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../globals';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TabsPage implements OnInit {
  paletteToggle = false;
  constructor(public router: Router, public user: User) {}

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
    this.router.navigate(['/login']);
  }

}
