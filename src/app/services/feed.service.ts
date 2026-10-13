import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


export class FeedItem {
  pg = '';
  data = '';
  ora = '';
  testo = '';
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
	http = inject(HttpClient);

	public getDadi(userid: number) {
		return this.http.get<FeedItem[]>('https://www.roma-by-night.it/ionicPHP/dadi.php?userid='+userid);
	}


}
