import { Injectable } from '@angular/core';

@Injectable()
export class Background {
  public IDbackground = 0;
  public NomeBackground = '';
  public LivelloBG = 0;
}


@Injectable()
export class askill {
    public tipologia = 0;
    public nomeskill = '';
    public livello = 0;
}

@Injectable()
export class apoteri2  {
    public nomepotere = '';
    public attivo = '';
    public livellopot = 0;    
}

@Injectable()
export class apoteri  {
    public iddisciplina: number;
    public nomedisc: string;
    public poteri: Array<apoteri2>;

    constructor () {
        this.iddisciplina = 0;
        this.nomedisc = '';
        this.poteri = [];
    }
}

@Injectable()
export class afulldata  {
    public PScorrenti = 0;
    public addbp = 0;           // non usato
    public addcaccia = 0;
    public addsete = 0;         
    public attivazione = 0;
    public attutimento = 0;
    public bane = 0;
    public bgbase = 0 ;
    public bio = '';
    public bloodp = 0 ;               
    public bloodpmax = 0;       // non usato
    public carisma = 0;
    public destrezza = 0;
    public fama1 = 0;
    public fama2 = 0;
    public fama3 = 0;
    public fdv = 0;
    public fdvbase = 0;         // non usato
    public fdvmax = 0;
    public forza = 0;
    public generazione = 0;
    public idclan = '';          
    public idsentiero = 0 ;     // non usato
    public idstatus = 0;        // non usato
    public idutente = 0;
    public intelligenza = 0;
    public lastcaccia = '';
    public lastfdv = '';
    public lastps = '';
    public lastvitae = '';
    public maxstat = 0 ;        // non usato
    public nomeclan = '';
    public nomepg = '';
    public nomeplayer = '';
    public notemaster = '';
    public percezione = 0;
    public persuasione = 0;
    public prontezza = 0;
    public ps = 0;              // non usato
    public psturno = 0;         // non usato
    public rifugio = '';
    public rigen = 0;
    public saggezza = 0;
    public sentiero = '';
    public sete = 0;
    public status = '';
    public urldt = '';
    public valsentiero = 0;     // non usato
    public xp = 0;
    public xpspesi = 0;
    public zona = '';
    public psvuoti = 0;         // calcolato
    public setetot = 0;         // calcolato
    public pf = 0;              // calcolato
    public rd = 0;              // calcolato
    public rp = 0;              // calcolato
    public note = '';
    public nummaesta = 0;
    public lastmaesta = ''; //non usato
}

@Injectable()
export class apottaum  {
    public idtaum2 = 0;
    public livello = 0;
    public nometaum2 = '';
}

@Injectable()
export class ataum  {
    public nometaum: string;
    public livellopot: number;
    public poteri: Array<apottaum>; 

    constructor () {
        this.nometaum = '';
        this.livellopot = 0 ;
        this.poteri = [];
    }
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
    public nomenecro: string;
    public livellopot: number;
    public poteri: Array<apotnecro>; 

    constructor () {
        this.nomenecro = '';
        this.livellopot = 0 ;
        this.poteri = [];
    }
}

export class Amalgama {
    idamalgama: number = 0;
    nomeamalgama: string = '';
    disc1: string = '';
    lvldisc1: number = 0;
    disc2: string = '';
    lvldisc2: number = 0;
    ps: number = 0;
    fdv: number = 0;
}

@Injectable()
export class User {
    public type: string;
    public username: string;
    public userid: number;
    public fulldata: afulldata;
    public skill: Array<askill>;
    public poteri: Array<apoteri>;
    public taum: Array<ataum>;
    public necro: Array<anecro>;
    public incaccia: Number;
    public amalgame: Array<Amalgama>;
  
    constructor () {
        this.type = 'V';
        this.username = '';
        this.userid = 0;
        this.fulldata = new afulldata;
        this.skill = [];
        this.poteri = [];
        this.taum = [];
        this.necro = [];
        this.incaccia = 0 ;
        this.amalgame = [];
    }
  }
  
  @Injectable()
  export class Oggetto {
    public id = '';
  }


  export class RubricaItem {
    contatto: string;
    cell: number;
    email: number;
    home: number;
    note: string;
    idrubrica: number;
   
    constructor(contatto: string, cell: number, email: number, home: number, note: string, idrubrica: number) {
      this.contatto = contatto;
      this.cell = cell;
      this.email = email;
      this.home = home;
      this.note = note;
      this.idrubrica = idrubrica;
    }
  }

  @Injectable()
  export class ToChange {
    contatto: string;
    cell: number;
    email: number;
    home: number;
    note: string;
    idrubrica: number;
  
    constructor () {
        this.contatto = '';
        this.cell = 0;
        this.email = 0;
        this.home = 0;
        this.note = '';
        this.idrubrica = 0;
    }
  }

export class Legame {
    nomepg: string = '';
    livello: number = 0;
    dataultima: string = '';
}

export class Utente {
	nomepg: string;
	id: number;

	constructor(nomepg: string, id: number) {
		this.nomepg = nomepg;
		this.id = id;
	}

}

