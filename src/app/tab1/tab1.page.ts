import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { Router } from '@angular/router';
import { User  } from '../globals';
import { AuthserviceService } from '../services/authservice.service';

export interface datips {
  PScorrenti: number;
  fdv: number;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class Tab1Page {
  constructor(
    public user: User,
    private authentication: AuthserviceService,
    private router: Router
  ) {}


  ionViewWillEnter() {
    // console.log ("2 user - " , this.user);
  } 

  
  public logoutx() {
    this.router.navigate(['login']);
  }
  

  
  doRefresh(event: RefresherCustomEvent) {    
    setTimeout(() => {
      this.authentication.loadpscorrenti(this.user.idutente).subscribe((data: datips) => {
          this.user.PScorrenti = data.PScorrenti;
          this.user.fdv = data.fdv;
        });
      event.target.complete();
    }, 2000);
  }
  
}
