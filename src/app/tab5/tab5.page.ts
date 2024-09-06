import { Component, OnInit } from '@angular/core';
import { User } from '../globals';
import { FeedService, FeedItem } from '../services/feed.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  public alertButtons = ['OK'];
  tiridado: Array<FeedItem>;


  constructor(public user: User, public feed: FeedService, public http: HttpClient, public router: Router) { 
    this.tiridado = [];
    this.loadDadi();
  }

  ngOnInit() {
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadDadi();
      event.target.complete();
    }, 2000);
  }



  loadDadi() : any {
    this.feed.getDadi(this.user['userid']).subscribe(
      (allFeeds : any) => {
        this.tiridado = allFeeds;
      });
  }

  tiraildado(){

    var link = 'https://www.roma-by-night.it/ionicPHP/lanciadado.php';
    var mypost = JSON.stringify({userid: this.user['userid'] });

    this.http.post<any>(link, mypost)
    .subscribe(res =>  {
      setTimeout( this.loadDadi() , 1000);
    });

  }
  usafdv(){
    var link = 'https://www.roma-by-night.it/ionicPHP/usofdv.php';
    var mypost = JSON.stringify({userid: this.user['userid'] });

    this.http.post<any>(link, mypost)
    .subscribe(res =>  {
      setTimeout( this.loadDadi() , 1000);
    });


    this.user.fulldata['fdv']--;
    this.user.fulldata['rd'] = Math.floor(
      (this.user.fulldata['carisma'] + this.user.fulldata['intelligenza'] + this.user.fulldata['prontezza'] + this.user.fulldata['percezione'] + this.user.fulldata['fdv'] )/5
    );


  }
  menops(){

    var link = 'https://www.roma-by-night.it/ionicPHP/menops2.php?id='+this.user['userid']

    this.http.get<any>(link)
    .subscribe(res =>  {

      this.user.fulldata.PScorrenti-- ;
      this.user.fulldata.psvuoti++;
      
      setTimeout( this.loadDadi() , 1000);
    });
  }

  gocaccia(){
    var id = 0;
    this.router.navigate(['/tabs/caccia',id]);
  }


  golegami(){
    this.router.navigate(['/tabs/legami']);
  }

  gomorte(){
    this.router.navigate(['/tabs/morte']);
  }

  godisciplina(disc:number , nomed: string){

    if (disc == 98) {
      // go TAUM
      this.router.navigate(['/tabs/taum']);
      
    } else if (disc == 99) {
      // go NECRO
      this.router.navigate(['/tabs/necro']);
     
    } else {
      // go GENERICo
      // console.log("disc ", disc, "nomed ", nomed)
      this.router.navigate(['/tabs/poteri',disc, nomed]);
      
      
  	}
  }

  addpx(){
    var id = 0;
    this.router.navigate(['/tabs/addpx']);
  }

  goamalgame(){
    console.log("amalgame");
  }

  ionViewWillEnter () {
    this.tiridado = [];
    this.loadDadi();
  }
}
