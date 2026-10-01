import { Injectable, inject } from '@angular/core';
import { User } from '../globals';
import { AuthserviceService } from './authservice.service';

// Gestisce la routine oraria (10 esecuzioni) che chiama menops e decrementa PScorrenti,
// persistendo lo stato (ora di attivazione ed esecuzioni rimaste) in localStorage.
@Injectable({ providedIn: 'root' })
export class MenopsRoutineService {
  private static readonly START_KEY = 'NotturnaMenopsRoutineStart';
  private static readonly RESTANTI_KEY = 'NotturnaMenopsRoutineRestanti';
  private static readonly TOTALE = 10;
  private static readonly INTERVALLO_MS = 60 * 60 * 1000; // 1 ora

  private authservice = inject(AuthserviceService);
  private timeout?: ReturnType<typeof setTimeout>;

  // Avvia la routine (10 esecuzioni); se già attiva non fa nulla
  avvia(user: User) {
    const restantiSalvati = Number(
      window.localStorage.getItem(MenopsRoutineService.RESTANTI_KEY)
    );

    if (restantiSalvati > 0) {
      return; // routine già in corso
    }

    const start = Date.now();
    const restanti = MenopsRoutineService.TOTALE;

    window.localStorage.setItem(MenopsRoutineService.START_KEY, start.toString());
    window.localStorage.setItem(MenopsRoutineService.RESTANTI_KEY, restanti.toString());

    this.pianifica(user, start, restanti);
  }

  // Riprende, se presente, la routine salvata nello storage locale
  ripristina(user: User) {
    const start = Number(window.localStorage.getItem(MenopsRoutineService.START_KEY));
    const restanti = Number(window.localStorage.getItem(MenopsRoutineService.RESTANTI_KEY));

    if (start > 0 && restanti > 0) {
      this.pianifica(user, start, restanti);
    }
  }

  // Da chiamare al login: riallinea lo stato della routine al tempo realmente trascorso
  riconciliaAlLogin(user: User) {
    const start = Number(window.localStorage.getItem(MenopsRoutineService.START_KEY));
    const restanti = Number(window.localStorage.getItem(MenopsRoutineService.RESTANTI_KEY));

    if (!(start > 0 && restanti > 0)) {
      return; // nessuna routine attiva
    }

    const elapsed = Date.now() - start;
    const durataTotale = MenopsRoutineService.TOTALE * MenopsRoutineService.INTERVALLO_MS;

    if (elapsed >= durataTotale) {
      // prima esecuzione avvenuta più di 10 ore fa: la routine è scaduta
      this.cancella();
      return;
    }

    // prima esecuzione avvenuta meno di 10 ore fa: recupera le esecuzioni mancate
    const eseguiteAttuali = MenopsRoutineService.TOTALE - restanti;
    const eseguiteDovute = Math.min(
      MenopsRoutineService.TOTALE,
      Math.floor(elapsed / MenopsRoutineService.INTERVALLO_MS)
    );
    const daRecuperare = eseguiteDovute - eseguiteAttuali;

    this.recuperaEsecuzioni(user, start, restanti, daRecuperare);
  }

  private recuperaEsecuzioni(user: User, start: number, restanti: number, daRecuperare: number) {
    if (daRecuperare <= 0) {
      this.pianifica(user, start, restanti);
      return;
    }

    this.authservice.menops(user.idutente).subscribe(() => {
      user.PScorrenti--;
      user.puntiSangueAggiornati.next();

      const restantiAggiornati = restanti - 1;
      window.localStorage.setItem(
        MenopsRoutineService.RESTANTI_KEY,
        restantiAggiornati.toString()
      );

      this.recuperaEsecuzioni(user, start, restantiAggiornati, daRecuperare - 1);
    });
  }

  private pianifica(user: User, start: number, restanti: number) {
    clearTimeout(this.timeout);

    if (restanti <= 0) {
      this.cancella();
      return;
    }

    const eseguite = MenopsRoutineService.TOTALE - restanti;
    const prossimaEsecuzione = start + (eseguite + 1) * MenopsRoutineService.INTERVALLO_MS;
    const attesa = Math.max(prossimaEsecuzione - Date.now(), 0);

    this.timeout = setTimeout(() => {
      this.eseguiEsecuzione(user, start, restanti);
    }, attesa);
  }

  private eseguiEsecuzione(user: User, start: number, restanti: number) {
    this.authservice.menops(user.idutente).subscribe(() => {
      user.PScorrenti--;
      user.puntiSangueAggiornati.next();

      const restantiAggiornati = restanti - 1;
      window.localStorage.setItem(
        MenopsRoutineService.RESTANTI_KEY,
        restantiAggiornati.toString()
      );

      this.pianifica(user, start, restantiAggiornati);
    });
  }

  private cancella() {
    clearTimeout(this.timeout);
    window.localStorage.removeItem(MenopsRoutineService.START_KEY);
    window.localStorage.removeItem(MenopsRoutineService.RESTANTI_KEY);
  }

  fermaTimer() {
    clearTimeout(this.timeout);
  }
}
