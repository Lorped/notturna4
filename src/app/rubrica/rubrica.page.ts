import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { RubricaItem, User, ToChange } from '../globals';

@Component({
  selector: 'app-rubrica',
  templateUrl: './rubrica.page.html',
  styleUrls: ['./rubrica.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RubricaPage  {
  constructor(private authservice: AuthserviceService, private user: User, private router: Router, private tochange: ToChange) {}

  rubrica: Array<RubricaItem> = [];

   ionViewWillEnter(){
    this.authservice.loadrubrica(this.user.idutente).subscribe((data) => {
      this.rubrica = data;
    });
   }

  add() {
    this.router.navigate(['/tabs/addcontatto']);
  }
  edit(id: number) {
    const tochange=this.rubrica.find((item) => item.idrubrica === id);
    if(tochange) {
      this.tochange.idrubrica = tochange.idrubrica;
      this.tochange.contatto = tochange.contatto;
      this.tochange.cell = tochange.cell;
      this.tochange.home = tochange.home;
      this.tochange.note = tochange.note;

      this.router.navigate(['/tabs/changecontatto']);
    }


  }

  delete(id: number) {
    this.authservice.delrubrica(id).subscribe(() => {
      this.authservice.loadrubrica(this.user.idutente).subscribe(() => {
        this.ionViewWillEnter();
      });
    });
  }

}
