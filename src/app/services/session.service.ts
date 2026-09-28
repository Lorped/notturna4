import { Injectable, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User, Userskill } from '../globals';

@Injectable({
  providedIn: 'root',
})
export class SessionService {

  private navController = inject(NavController);
  private user = inject(User);
  private userskill = inject(Userskill);
  constructor() {}

  async logout(): Promise<boolean> {
    this.user.reset();
    this.userskill.reset();
    return this.navController.navigateRoot('/login');
  }
}