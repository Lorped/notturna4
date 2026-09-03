import { Component, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-morte',
  templateUrl: './morte.page.html',
  styleUrls: ['./morte.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MortePage {
  constructor(
    public user: User,
    public authservice: AuthserviceService,
    public router: Router
  ) {}

  // ngOnInit() {}

  morte() {
    this.authservice.morteultima(this.user['idutente']).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
