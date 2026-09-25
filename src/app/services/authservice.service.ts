/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http: HttpClient) { }

  
  login(username: string, password: string) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/login.php', {
      username: username,
      password: password
    });
  }

  skill(userid: number) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/skill.php', {
      userid: userid
    });
  }

  poteri(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/listpoteri.php?id='+userid);
  }

  taum(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/listtaum.php?id='+userid);
  }

  loadpscorrenti(userid: number){

		return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/getps.php?id='+userid);

  }

  loadrubrica(userid: number){
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/rubrica.php?id='+userid );
  }

  addcontatto(userid: number, contatto: string, cell: number, home: number, note: string){
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/addrubrica.php', {
      idutente: userid,
      contatto: contatto,
      cell: cell,
      home: home,
      note: note
    });
  }

  delrubrica(idrubrica: number){
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/delrubrica.php?id='+idrubrica );
  }
  changerubrica(idrubrica: number, contatto: string, cell: number,  home: number, note: string){
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/changerubrica.php', {
      idrubrica: idrubrica,
      contatto: contatto,
      cell: cell,
      home: home,
      note: note
    });
  }

  getpregi(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/getpregi.php?id='+userid); 
  }

  morteultima(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/morte.php?id='+userid); 
  }

  barcode(userid: number, barcode: string) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/barcode.php?id=' + userid + '&barcode=' + barcode);
  }

  getscan(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/getscan.php?id=' + userid);
  }

  msgtomaster(userid: number, messaggio: string) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/msgtomaster.php', {
      idutente: userid,
      messaggio: messaggio
    });
  }

  caccia(userid: number, bs: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/caccia.php?id=' + userid + '&BS=' + bs);
  }
  cacciaanim(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/caccia-anim.php?id=' + userid);
  }

  modifcanote(userid: number, note: string) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/modificanote.php', {
      idutente: userid,
      note: note
    });
  }

  menops(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/menops2.php?id=' + userid);
  }

  usofdv(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/usofdv.php?id=' + userid);
  }

  focusattr(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/focusattr.php?id=' + userid);
  }

  usopotere(userid: number, potere: string, idpotere: number, livello: number, disciplina: string) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/usopotere.php', {
      idutente: userid,
      potere: potere,
      idpotere: idpotere,
      livello: livello,
      disciplina: disciplina
    });
  }

  usonecrotaum(userid: number, potere: string, idpotere: number, livello: number, disciplina: string, necrotaum: string) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/usonecrotaum.php', {
      idutente: userid,
      potere: potere,
      idpotere: idpotere,
      livello: livello,
      disciplina: disciplina,
      necrotaum: necrotaum
    });
  }

  furtodivitae(userid: number) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/furtodivitae.php', {
      idutente: userid
    });
  }

  listautenti(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/utenti.php?excl=' + userid);
  }

  invialegame(userid: number, pgscelto: number) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/legami.php', {
      target: userid,
      domitor: pgscelto
    });
  }

  getlegami(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/getlegami.php?id=' + userid);
  }

  lanciadado(userid: number) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/lanciadado.php', {
      userid: userid
    });
  }

  inviamessaggiotente(userid: number, destinatario: number, messaggio: string) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/inviamessaggioutente.php', {
      idutente: userid,
      destinatario: destinatario,
      messaggio: messaggio
    });
  }

  updateid(userid: number, id: string) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/updateid.php?id=' + id + '&userid=' + userid );
  }

  getregistra() {
    return this.http.get<any>('https://www.roma-by-night.it/Notturna2/wsPHP/getregistra.php');
  }

  tiroresistenza(userid: number, dom:number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/tiroresistenza.php?id=' + userid + '&dom=' + dom );
  }

  usabol(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/bol.php?id=' + userid);
  }

}
