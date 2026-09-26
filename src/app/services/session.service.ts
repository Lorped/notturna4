import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User, Userskill } from '../globals';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(
    private navController: NavController,
    private user: User,
    private userskill: Userskill
  ) {}

  async logout(): Promise<boolean> {
    this.user.reset();
    this.userskill.reset();
    return this.navController.navigateRoot('/login');
  }
}