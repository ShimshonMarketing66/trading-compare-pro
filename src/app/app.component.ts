import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { TranslateService } from '@ngx-translate/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import firebase from 'firebase';
import { AuthDataProvider } from '../providers/auth-data/auth-data';
import { Profile } from '../models/profile-model';
import { Sim } from '@ionic-native/sim';
import { GlobalProvider } from '../providers/global/global';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any ;
  isLogin: boolean;
  onAuthStateChangedCalled: boolean = false;
  firstTime: boolean = true;
  _id: string;

  constructor(
    public global:GlobalProvider,
    public sim:Sim,
    public authData: AuthDataProvider,
    private androidPermissions: AndroidPermissions,
    private fcm: FCM,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
  ) {
    this.loop();
    firebase.auth().onAuthStateChanged(user => {
      this.onAuthStateChangedCalled = true;
      if (user) {
        this.authData.user_firebase = user;
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          authData.idToken = idToken;
        }).catch(function(error) {
         console.error("cannot get token",error);
        });
        
        this._id = user.uid;
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    });

    translate.setDefaultLang('english');
  }

  checkPermissionSim() {
    this.sim.hasReadPermission().then((info) => {
      if (!info) {
        this.sim.requestReadPermission().then(() => {
          console.log('Permission granted')
          this.sim.getSimInfo().then(
            (info) => {
              console.log("info", info);
            },
            (err) => {
              console.log('Unable to get sim info: ', err);
            });
        },
          () => {
            console.log('Permission denied')
          }
        );
      } 
    })
  }
  
  checkPermissionREAD_SMS() :Promise<any> {
    return new Promise((resolve)=>{
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
      .then(() => {
        console.log("permited checkPermissionREAD_SMS");
        resolve();
      },
        err => {
          console.log("not permited checkPermissionREAD_SMS");
          resolve();
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
            .then(() => {
              console.log("permited checkPermissionREAD_SMS");
              resolve();
            },
              err => {
                console.log("not accept checkPermissionREAD_SMS");
                resolve();
              });
        });

   
    })
   
  }


  loop() {
    setTimeout(() => {
      if (this.onAuthStateChangedCalled) {
        if (this.isLogin) {
          this.authData.getProfileFromServer(this._id).then((user:Profile) => {
            user.countryData.country =  user.countryData.country.toLowerCase().replace("-"," ");
            this.authData.user = user;
            
            if (user.verifyData.is_phone_number_verified) {
              this.global.initialProviders().then(()=>{
                this.rootPage = "main-tabs";
                this.platform.ready().then(() => {
                  this.statusBar.styleDefault();
                  this.splashScreen.hide();
                })
              })
            }else{
              this.rootPage = "enter-phone";
            }
           
            this.platform.ready().then(() => {
              this.statusBar.styleDefault();
              this.splashScreen.hide();
              this.initial_app_when_login();
            })
          })
          .catch((err)=>{
            console.log("err this.authData.getProfileFromServer app commponnent"); 
            this.rootPage = "login-tabs";
          })
        } else {
          this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.initial_app_when_log_out();
          })
          this.rootPage = "login-tabs";
        }
      } else {
        this.loop();
      }
    }, 1000 * 2)
  }

  initial_app_when_login(){
    console.log("initial_app_when_login avi1");
    
      if (! this.platform.is("cordova")) {
        this.authData.platform = "browser";
      } else if ( this.platform.is("android")) {
        this.authData.platform = "android";
      } else if ( this.platform.is("ios")) {
        this.authData.platform = "ios";
      }
      if (! this.platform.is("cordova")) {
        return;
      }
      console.log("initial_app_when_login avi2");
      this.fcm.onNotification().subscribe(data => {
        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      });
      var x = this.authData.user.token_notification;
      
      if (x  == undefined || x  == null || x  === '' ) {        
        this.fcm.getToken().then(token => {
          this.authData.updateFields({
            token_notification:token
           }).then(()=>{
             console.log( "token_notification updated");
           })
           .catch(()=>{
            console.log( "token_notification field to update");
           })
          }).catch((err)=>{
            console.log("errrrr",err);
            
          })
      }

     

      this.fcm.onTokenRefresh().subscribe(token => {
       this.authData.updateFields({
        token_notification:token
       }).then(()=>{
         console.log("token_notification updated");

       })
       .catch(()=>{
        console.log("token_notification field to update");

        ;
       })
      });
  }

  initial_app_when_log_out(){
    if (! this.platform.is("cordova")) {
      this.authData.platform = "browser";
    } else if ( this.platform.is("android")) {
      this.authData.platform = "android";
    } else if ( this.platform.is("ios")) {
      this.authData.platform = "ios";
    }
    if (!this.platform.is("cordova")) {
      return;
    }
    this.checkPermission();   
}

checkPermission(){
  console.log("checkPermission");
  
  this.checkPermissionREAD_SMS().then(()=>{
    this.checkPermissionREAD_SMS().then(()=>{  
    })
  })
}
}

