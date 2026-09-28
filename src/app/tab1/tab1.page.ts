import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RefresherCustomEvent } from '@ionic/angular';
import { User  } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { SessionService } from '../services/session.service';

export interface datips {
  PScorrenti: number;
  fdv: number;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  public user = inject(User);
  private session = inject(SessionService);
  private authentication = inject(AuthserviceService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.user.puntiSangueAggiornati
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changeDetectorRef.markForCheck());
  }


  ionViewWillEnter() { } 

  
  public logoutx() {
    void this.session.logout();
  }
  

  
  doRefresh(event: RefresherCustomEvent) {    
    setTimeout(() => {
      this.authentication.loadpscorrenti(this.user.idutente).subscribe((data: datips) => {
          this.user.PScorrenti = data.PScorrenti;
          this.user.fdv = data.fdv;
          this.changeDetectorRef.markForCheck();
        });
      event.target.complete();
    }, 2000);
  }
  
}
