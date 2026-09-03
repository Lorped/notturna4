import { Component, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../globals';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-modificanote',
  templateUrl: './modificanote.page.html',
  styleUrls: ['./modificanote.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ModificanotePage  {
  constructor(
    public user: User,
    private authService: AuthserviceService,
  ) {}

  noteiniziali = '';

 

  ionViewWillEnter() {
    this.noteiniziali = this.user.note;
  }

  noteModificate(): boolean {
    return this.user.note != this.noteiniziali;
  }

  modifica() {
    this.authService.modifcanote(this.user.idutente, this.user.note).subscribe(() => {
      this.noteiniziali = this.user.note;
    });
  }
}
