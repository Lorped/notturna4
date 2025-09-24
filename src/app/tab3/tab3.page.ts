import { Component } from '@angular/core';
import { User } from '../globals';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  note: string = '';
  notemaster: string = '';
  link: string = '';

  xpspendibili = 0 ;
  xpdisponibili = 0;

  constructor(public user: User, private iab: InAppBrowser, private router: Router) {


	}

  	nl2br (str: string) {
		// Some latest browsers when str is null return and unexpected null value
		if (typeof str === 'undefined' || str === null) {
    		return '';
		}
		// Adjust comment to avoid issue on locutus.io display
  		var breakTag =  '<br>'   ;
  		return (str + '')
    		.replace(/(\r\n|\n\r|\r|\n)/g, breakTag + '$1')
	}

  	openUrl() {
		//const browser = this.iab.create(this.link);
		this.iab.create(this.link,'_system');
	}

  	openUrl2() {
    	const link = 'https://drive.google.com/file/d/0BwbyMyT-GT-UZFBwNmp4SHZ6SFk/view';
		//const browser = this.iab.create(this.link);
		this.iab.create(link,'_system');
	}

  	openUrl3() {
    	const link = 'https://drive.google.com/file/d/1RoDz3IopLmZtTK_7zDms7ClkcBlZdI31/view';
		//const browser = this.iab.create(this.link);
		this.iab.create(link,'_system');
	}

	openUrlDT() {
    	//console.log (this.myuser);
    	var link = this.user.fulldata['urldt'];
		//const browser = this.iab.create(this.link);
		this.iab.create(link,'_system');
	}

	modifica(){
		// this.navCtrl.push('ModificanotePage', { "parentPage": this });
		this.router.navigate(['/tabs/modificanote']);
	}

	reloadnote(){
		this.note=this.nl2br(this.user.fulldata['note']);
    	this.notemaster=this.nl2br(this.user.fulldata['notemaster']);
	}

	ionViewWillEnter (){

	// console.log(this.fulldata['idclan']);
		switch (this.user.fulldata['idclan']) {
			case "1":   //  Toreador
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UZ2pKb0RzRlZoaVU/view";
			break;
			case "2":   //  Ventrue
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UTTRodGZXdzdCVXM/view";
			break;
			case "3":		// Nosferatu
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UUDNmT3llNjZ3UXM/view";
			break;
			case "4":		// Brujah
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UNFZURFpYR2pfNVk/view";
			break;
			case "5":		// Gangrel
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UcFRxVFRkNnRLb28/view";
			break;
			case "6":		// Malkavian
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UZ2dRSW1VOGFWNDQ/view";
			break;
			case "7":		// Tremere
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-US3d3OEpnbV9Ccjg/view";
			break;
			case "8":		// Lasombra
				this.link = "https://drive.google.com/file/d/1veEpi_TDGZz-xIFbO1PeVfHrprrDISWF/view";
			break;
			case "9":		// Tzimisce
				this.link = "https://drive.google.com/file/d/1AyN-Ofnhw-m5LQcNMFEHYOnLclb-3N_0/view";
			break;
			case "10":	// Assamiti
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-ULXpGWkxLNWZhaDg/view";
			break;
			case "11":	// Giovanni
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UYTVUZFlNeEo2N0k/view";
			break;
			case "12":	// Ravnos
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UVTF3QWJ2TzNXZk0/view";
			break;
			case "13":	// Setiti
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UOUo0dll2NjRDOHc/view";
			break;
			case "14":		// Cappadoci
			this.link = "https://drive.google.com/file/d/1WqSxecMNGQ0ayh6MLGM-FHCP1LaL0khZ/view";
			break;
			case "20":	// vili
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UOWhsMExKd2YzTVU/view";
			break;
			case "21":		// Gangrel - city
				this.link = "https://drive.google.com/file/d/0BwbyMyT-GT-UcFRxVFRkNnRLb28/view";
			break;
		}


		this.note=this.nl2br(this.user.fulldata['note']);
    	this.notemaster=this.nl2br(this.user.fulldata['notemaster']);

		if ( this.user.fulldata.xp > 113 ) {
			this.xpspendibili = 86 + ( this.user.fulldata.xp - 113)/2 ;  
		} else if ( this.user.fulldata.xp > 32 ) {
			this.xpspendibili = 32 + ( this.user.fulldata.xp - 32)/3*2;
		} else {
			this.xpspendibili = this.user.fulldata.xp;
		}
	
		this.xpdisponibili = this.xpspendibili - this.user.fulldata.xpspesi;
			
		this.xpspendibili = Math.round(this.xpspendibili*10)/10;
		this.xpdisponibili = Math.round(this.xpdisponibili*10)/10;
	}
}
