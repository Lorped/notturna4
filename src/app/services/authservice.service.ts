import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
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
    }).pipe(
    map(user => {
      // console.log ('auth :' , user);
      return user;
    }));
  }

  skill(userid: number) {
    return this.http.post<any>('https://www.roma-by-night.it/ionicPHP/skill.php', {
      userid: userid
    }).pipe(
    map(data => {
      // console.log ('skill :' , data);
      return data;
    }));
  }

  poteri(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/listpoteri.php?id='+userid
    ).pipe(
    map(data => {
      //  ('poteri :' , data);
      return data;
    }));
  }

  taum(userid: number) {
    return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/listtaum.php?id='+userid
    ).pipe(
    map(data => {
      // console.log ('poteri :' , data);
      return data;
    }));
  }

  loadpscorrenti(userid: number){

		return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/getps.php?id='+userid
		).pipe(
      map(data => {
        // console.log ('PS :' , data);
        return data;
      }));

  }

  listamalgame(userid: number){

		return this.http.get<any>('https://www.roma-by-night.it/ionicPHP/listamalgame.php?id='+userid
		).pipe(
      map(data => {
        // console.log ('PS :' , data);
        return data;
      }));

  }

}
