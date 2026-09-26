import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { Skill, User, Userskill } from '../globals';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  let user: User;
  let userskill: Userskill;
  let navigatedPaths: string[];

  beforeEach(() => {
    navigatedPaths = [];
    TestBed.configureTestingModule({
      providers: [
        SessionService,
        {
          provide: NavController,
          useValue: {
            navigateRoot: (path: string) => {
              navigatedPaths.push(path);
              return Promise.resolve(true);
            },
          },
        },
      ],
    });

    service = TestBed.inject(SessionService);
    user = TestBed.inject(User);
    userskill = TestBed.inject(Userskill);
  });

  it('clears session state and navigates to the login root', async () => {
    const bloodPointsSubject = user.puntiSangueAggiornati;
    user.idutente = 42;
    user.nomepg = 'Personaggio';
    Object.assign(user, { sessionOnly: 'stale' });
    userskill.skill.push(new Skill());

    await service.logout();

    expect(user.idutente).toBe(0);
    expect(user.nomepg).toBe('');
    expect('sessionOnly' in user).toBe(false);
    expect(user.puntiSangueAggiornati).toBe(bloodPointsSubject);
    expect(userskill.skill).toEqual([]);
    expect(navigatedPaths).toEqual(['/login']);
  });
});