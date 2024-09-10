import { Component, OnInit } from '@angular/core';
import { map }  from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { User } from '../globals';
import { AuthserviceService } from '../services/authservice.service';

import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { CapacitorConfig } from '@capacitor/cli';
import { FCM } from "@capacitor-community/fcm";

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username = '' ;
	userid = 0 ;

	saveme= {
		checked: false
	};
  registerCredentials = { username: '' , password: '' };

  constructor(private router: Router, private http: HttpClient, private authentication: AuthserviceService , private user: User, private loadingCtrl: LoadingController) { 

      this.registerCredentials.username = window.localStorage.getItem( "notturnauserid" ) ! ;
      this.registerCredentials.password = window.localStorage.getItem( "notturnapasswd" ) ! ;
	    if (this.registerCredentials.username != '' )  { this.saveme.checked = true; }

  }

  ngOnInit() {
    
  }

  public login() {

    // console.log( this.registerCredentials.username );
    // console.log( this.registerCredentials.password );

    this.authentication.login(this.registerCredentials.username, this.registerCredentials.password)
    .subscribe(
      data => {

        //save if required
        if ( this.saveme.checked == true ) {
          window.localStorage.setItem( "notturnauserid" , this.registerCredentials.username );
          window.localStorage.setItem( "notturnapasswd" , this.registerCredentials.password );
        } else {
          window.localStorage.removeItem( "notturnauserid" );
          window.localStorage.removeItem( "notturnapasswd" );
        }

        this.user.username = this.registerCredentials.username;
        this.user.userid = data['idutente'];
        this.user.fulldata = data;

        // fix
        this.user.fulldata['sete'] = Number( this.user.fulldata['sete'] );
        this.user.fulldata['addsete'] = Number( this.user.fulldata['addsete'] );
        this.user.fulldata['PScorrenti'] = Number( this.user.fulldata['PScorrenti'] ) ;

        this.user.fulldata['forza'] = Number( this.user.fulldata['forza'] );
        this.user.fulldata['destrezza'] = Number( this.user.fulldata['destrezza'] );
        this.user.fulldata['attutimento'] = Number( this.user.fulldata['attutimento'] );
        this.user.fulldata['carisma'] = Number( this.user.fulldata['carisma'] );
        this.user.fulldata['persuasione'] = Number( this.user.fulldata['persuasione'] );
        this.user.fulldata['saggezza'] = Number( this.user.fulldata['saggezza'] );
        this.user.fulldata['prontezza'] = Number( this.user.fulldata['prontezza'] );
        this.user.fulldata['intelligenza'] = Number( this.user.fulldata['intelligenza'] );
        this.user.fulldata['percezione'] = Number( this.user.fulldata['percezione'] );

        this.user.fulldata['fdv'] = Number( this.user.fulldata['fdv'] );
        this.user.fulldata['fama1'] = Number( this.user.fulldata['fama1'] );
        this.user.fulldata['fama2'] = Number( this.user.fulldata['fama2'] );
        this.user.fulldata['fama3'] = Number( this.user.fulldata['fama3'] );

        this.user.fulldata['xp'] = Number( this.user.fulldata['xp'] );

        // this.user.fulldata['note']=this.nl2br(this.user.fulldata['note']);
        // this.user.fulldata['notemaster']=this.nl2br(this.user.fulldata['notemaster']);
        //

        this.user.fulldata['psvuoti'] = this.user.fulldata['sete']+this.user.fulldata['addsete']-this.user.fulldata['PScorrenti'];

        this.user.fulldata['setetot'] = this.user.fulldata['sete']+this.user.fulldata['addsete'];

        this.authentication.skill(this.user.userid)
        .subscribe(
          data => {
            this.user.skill = data;


            this.authentication.poteri(this.user.userid)
            .subscribe(
              data => {
                this.user.poteri = data;

                this.authentication.taum(this.user.userid)
                .subscribe(
                  data => {
                    this.user.taum=data[0].taum;
                    this.user.necro=data[0].necro;

                    // SETUP ALTRI VALORI

                    this.user.fulldata['rd'] = Math.floor(
                      (this.user.fulldata['carisma'] + this.user.fulldata['intelligenza'] + this.user.fulldata['prontezza'] + this.user.fulldata['percezione'] + this.user.fulldata['fdv'] )/5
                    );
                    this.user.fulldata.pf = ( 3 + this.user.fulldata['attutimento'])*2;
                
                    this.user.fulldata.rp = Math.floor ( this.user.fulldata['attutimento'] / 2 ) ;
                
                    for (let i = 0 ; i < this.user.skill.length ; i++) {
                      this.user.skill[i].livello = Number (this.user.skill[i].livello);
                
                      if ( this.user.skill[i].nomeskill == 'Schivare' ) {
                        this.user.fulldata.pf +=  this.user.skill[i].livello;
                      }
                      if ( this.user.skill[i].nomeskill == 'Robustezza' ) {
                        this.user.fulldata.pf +=  this.user.skill[i].livello;
                
                        this.user.fulldata.rp = Math.floor ( ( this.user.fulldata['attutimento'] + this.user.skill[i].livello ) / 2 ) ;
                
                        // vedo se ha poteri attivi
                        for (let j = 0 ; j< this.user.poteri.length ; j++) {
                          if (this.user.poteri[j].iddisciplina == 12) {
                            for (let k = 0 ; k< this.user.poteri[j].poteri.length ; k++) {
                              // console.log(this.myuser.poteri[j].poteri[k]);
                              if (this.user.poteri[j].poteri[k].nomepotere=='Resilienza') this.user.fulldata.pf += 5 + this.user.skill[i].livello;
                              if (this.user.poteri[j].poteri[k].nomepotere=='Sconfiggere le Debolezze') this.user.fulldata.pf += 5 ; //perchè +5 da liv.1
                            }
                          }
                        }
                      }
                      if ( this.user.skill[i].nomeskill == 'Ferita Permanente' ) {
                        this.user.fulldata.pf -=  3;
                      }
                      if ( this.user.skill[i].nomeskill == 'Nove Vite' ) {
                        this.user.fulldata.pf +=  10;
                      }
                    }

                    var cura = this.user.fulldata.rigen;
                    for (let i = 0 ; i< this.user.skill.length ; i++) {
                      if ( this.user.skill[i].nomeskill == 'Ferita Aperta #2' ) {
                        cura -=  1;
                      }
                      if ( this.user.skill[i].nomeskill == 'Ferita Aperta #3' ) {
                        cura -=  2;
                      }
                      if ( this.user.skill[i].nomeskill == 'Ferita Aperta #4' ) {
                        cura -=  3;
                      }
                    }
                    for (let i = 0 ; i< this.user.skill.length ; i++) {
                      if ( this.user.skill[i].nomeskill == 'Guarigione Lenta' ) {
                        cura =  Math.ceil(cura/2);
                      }
                    }
                    this.user.fulldata.rigen = cura;

                    this.authentication.listamalgame(this.user.userid).subscribe(
                      (data: any) => {
                        this.user.amalgame = data.amalgame;
                        //console.log(this.user.amalgame);
                        this.user.amalgame.forEach(element => {
                          element.fdv = Number (element.fdv);
                          element.ps = Number (element.ps);
                        });
                        //console.log(this.user.amalgame);

                      }
                    );

                    // console.log ('user finale: ', this.user);


                    // all done
                    this.loadingCtrl.dismiss();

                    this.pushsetup();

                    //this.router.navigate(['tabs']);

                  },
                  error => {
                    this.loadingCtrl.dismiss();
                    alert ('Error loading data4');
                  }
                );

              },
              error => {
                this.loadingCtrl.dismiss();
                alert ('Error loading data3');
              }
            )

          },
          error => {
            this.loadingCtrl.dismiss();
            alert ('Error loading data2');
          }
        );

        // console.log ('user: ', this.user);
      },
      error => {
        this.loadingCtrl.dismiss();
        //console.log(error);
        switch ( error['status'] ) {
          case 401:
            alert("Non autorizzato");
          break;
          case 404:
            alert("Scheda non trovata");
          break;
          default:
            alert("Server error");
        }
        // console.log('error');
      }
    );

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


  pushsetup() {
    // Request permission to use push notifications
    
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.createChannel(
      {
        name: 'Notturna Channel',
        id: 'PushPluginChannel',
        description: 'Notturna Channel',
        importance: 5,
        sound: 'notturna_sound'
      }
    );

    const config: CapacitorConfig = {
      plugins: {
        PushNotifications: {
          presentationOptions: ["badge", "sound", "alert"],
        },
      },
    };


    PushNotifications.addListener('registration', (token: Token) => {
      //alert('Push registration success, token: ' + token.value);

      let updateurl = 'https://www.roma-by-night.it/ionicPHP/updateid.php?userid='+ this.user.userid+'&id='+token.value;
			this.http.get(updateurl)
			.subscribe(res =>  {
					// updated
					//alert('Device registered '+token.value);
			});

    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //alert('Push received: ' + JSON.stringify(notification));
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
      },
    );

    
    FCM.subscribeTo({ topic: 'user' })
    .then(r => console.log(`subscribed to topic: user `))
    .catch(err => console.log(err));

    var atopic = 'userid' + this.user.userid;
    FCM.subscribeTo({ topic: atopic })
    .then(r => console.log(`subscribed to topic: `, atopic))
    .catch(err => console.log(err));

    var atopic2 =  this.user.fulldata.nomeclan;
    FCM.subscribeTo({ topic: atopic2 })
    .then(r => console.log(`subscribed to topic: `, atopic2))
    .catch(err => console.log(err));

    this.router.navigate(['tabs']);

  }





	

}
