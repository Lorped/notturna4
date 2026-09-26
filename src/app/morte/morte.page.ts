import { Component, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../globals';
import { AuthserviceService } from '../services/authservice.service';
import { SessionService } from '../services/session.service';

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
    private session: SessionService
  ) {}

  // ngOnInit() {}

  morte() {
    this.authservice.morteultima(this.user['idutente']).subscribe(() => {
      void this.session.logout();
    });
  }
}
