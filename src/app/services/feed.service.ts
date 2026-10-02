/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

export class FeedItem {
	pg: string;
	data: string;
	ora: string;
	testo: string;

	constructor(pg: string, data: string, ora: string, testo: string) {
    this.pg = pg;
	this.data = data;
    this.ora = ora;
    this.testo = testo;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
	http = inject(HttpClient);


  public getDadi(userid: number) {
    const url = 'https://www.roma-by-night.it/ionicPHP/dadi.php?last=0&userid='+userid;

	const tirididado: Array<FeedItem> = [];

	return this.http.get<any>(url).pipe(
    map( (res ) => {
		const status = res?.status;
		if ( status != 0 ) {
		  const objects = res?.post;
			if ( status == 1 ) {
				tirididado.push(
					new FeedItem(objects.pg, objects.data, objects.ora, objects.testo)
				);
			} else {
				for (const item of objects) {
              	tirididado.push(
                	new FeedItem(item.pg, item.data, item.ora, item.testo)
              	);
	   		}
		}
        // console.log( "feed tiridado= ", tirididado);
      	return tirididado;
			
	}
    return null;
    }));
  }


}
