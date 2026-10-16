import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class Background {
  public idback = 0;
  public nomeback = '';
  public livello = 0;
}
@Injectable()
export class Alleato {
  public idalleato = 0;
  public nomealleato = '';
  public livello = 0;
}
@Injectable()
export class Contatto {
  public idcontatto = 0;
  public nomecontatto = '';
  public livello = 0;
}


@Injectable()
export class Subskill {
    public idskill = 0;
    public nomeskill = '';
    public livello = 0;
}

@Injectable()
export class Skill {
    public tipologia = 0;
    public idskill = 0 ;
    public nomeskill = '';
    public livello = 0;
    public subskill: Subskill[] = [];
}


@Injectable()
export class Potere  {
    public idpotere = 0;
    public nomepotere = '';
    public attivo = '';
    public livellopot = 0;    
}

@Injectable()
export class Disciplina {
    public iddisciplina = 0;
    public nomedisc = '';
    public livello = 0;
    public focus = 0;
    public poteri: Potere[] = [];
}





@Injectable({ providedIn: 'root' })
export class User  {
  public idutente = 0 ;
  public nomeplayer = '' ;
  public nomepg = '';
  public idclan = 0;
  public nomeclan = ''; // from LEFT JOIN
  public idlds = 0 ;
  public nomelds = ''; // fron left join
  public generazione = 0;
  public forza = 0;
  public destrezza = 0;
  public attutimento = 0;
  public carisma = 0;
  public persuasione = 0;
  public saggezza = 0;
  public percezione = 0;
  public prontezza = 0;
  public intelligenza = 0;
  public fdv = 0;
  public fdvmax = 0;
  public idstatus = 0;
  public status = ''; // da LEFT JOIN
  public attivazione = 0  ; // da LEFT JOIN
  public maxps = 0  ; // da LEFT JOIN
  public PScorrenti = 0 ;
  public bonusrigen = 0 ; // da left join
  public rigen = 0 ; // da left join
  public bonusdisc = 0 ; // da left join
  public lastps = '' ; 
  public notemaster = '' ; 
  public lastcaccia = '' ;

  public nummaesta = 0 ;



  public frenesia = 0 ;      // da LEFT JOIN
  public cacciaobbligata = 0; // da LEFT JOIN
  public tempocaccia = 0;   // da LEFT JOIN

  public idsentiero = 0;
  public sentiero = ''; // da LEFT JOIN
  public valsentiero = 0 ;
  public fama1 = 0 ;
  public fama2 = 0 ;
  public fama3 = 0 ;

  public xp = 0 ;
  public xpspesi = 0 ;

  public bio = '';
  public note = '';
  public rifugio = '';
  public zona = '';

  public bloodp = 0;
  public maxdisc = 0 ; //da LEFT JOIN

  public bane = 0 ;
  public contanti = 0 ;

  public maxstat = 0 ; // from LEFT JOIN

  public IDcronaca = 0 ;
  public Descrizione = ''; // da LEFT JOIN

  public pregiolds = '';
  public difettolds = '';

  // valori calcolati
  public rd = 0;  //res dominazione
  public pf = 0;  //punti ferita
  public rp = 0;  //res paletto

  public incaccia = 0; //serve dopo
  public ToastFineCaccia = false; //serve dopo
    public readonly puntiSangueAggiornati = new Subject<void>();

  public linkurl = '';
  public bol = 0 ; // Sussurro di Vita

    reset(): void {
        const state = this as unknown as Record<string, unknown>;
        const defaults = new User();

        for (const key of Object.keys(state)) {
            if (key !== 'puntiSangueAggiornati') {
                delete state[key];
            }
        }

        for (const [key, value] of Object.entries(defaults)) {
            if (key !== 'puntiSangueAggiornati') {
                state[key] = value;
            }
    }
    }
}

@Injectable()
export class pregiodifetto  {
    public idpregio = 0;
    public nomepregio = '';
    public valore = 0;
    public classe = '';
}


@Injectable()
export class apottaum  {
    public idtaum2 = 0;
    public livello = 0;
    public nometaum2 = '';
}

@Injectable()
export class ataum  {
    public idtaum = 0;
    public nometaum = '';
    public livello = 0;
    public focus = 0;
    public poteri: apottaum[] = [ ]; 
}


@Injectable()
export class apotnecro  {
    public idnecro2 = 0;
    public livello = 0;
    public nomenecro2 = '';
    public attivo = '';
}

@Injectable()
export class anecro  {
    public idnecro = 0 ;
    public nomenecro = '';
    public livello = 0;
    public focus = 0;
    public poteri: apotnecro[] = [];
}

@Injectable()
export class Rituale  {
    public idrituale = 0;
    public livello = 0;
    public nomerituale = '';
}

@Injectable({ providedIn: 'root' })
export class Userskill {
    public skill: Skill[] = [];
    public otherskill: Skill[] = [];
    public discipline: Disciplina[] = [];
    public background: Background[] =[];
    public alleati: Alleato[] =[];
    public contatti: Contatto[] =[];
    public taum: ataum[] = [];
    public necro: anecro[] = [];
    public rituali: Rituale[] = [];

    reset(): void {
        const state = this as unknown as Record<string, unknown>;
        for (const key of Object.keys(state)) {
            delete state[key];
        }
        Object.assign(this, new Userskill());
    }
}


export class Esito {
    public motivo = '';
    public descrizione = '';
    public sino = '';
}

  
export class Oggetto {
    public id = '';         // ID SCANSIONE BARCODE
    public idoggetto = 0;  // VERO IDOGGETTO
    public nomeoggetto = '';
    public descrizione = '';
    public esito: Esito[] = [];
    public domanda = '';
    public R1 = '';
    public R2 = '';
    public esitoSI: Esito[] = [];
    public esitoNO: Esito[] = [];
    public datascan = '';
    public enigma = '';
    public soluzione = '';
    public premio = '';
}




export class RubricaItem {
    contatto = '';
    cell = 0;
    home = 0;
    note = '';
    idrubrica = 0;
  }

  @Injectable({ providedIn: 'root' })
  export class ToChange {
    contatto: string;
    cell: number;
    home: number;
    note: string;
    idrubrica: number;
  
    constructor () {
        this.contatto = '';
        this.cell = 0;
        this.home = 0;
        this.note = '';
        this.idrubrica = 0;
    }
  }

export class Legame {
    nomepg = '';
    livello = 0;
    dataultima = '';
}

export class Utente {
	nomepg = '';
	idutente = 0;

}

