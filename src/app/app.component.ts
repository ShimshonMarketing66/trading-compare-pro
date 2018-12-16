import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Platform, Nav, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { AuthDataProvider } from '../providers/auth-data/auth-data';
import { Profile } from '../models/profile-model';
import { GlobalProvider } from '../providers/global/global';
import { CodePush } from '@ionic-native/code-push';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { TrackProvider } from '../providers/track/track';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any;
  onAuthStateChangedCalled: boolean = false;
  firstTime: boolean = true;
  _id: string;

  constructor( 
    public track:TrackProvider,
    private toastCtrl: ToastController,
    public storage: Storage,
    public codePush: CodePush,
    public global: GlobalProvider,
    public authData: AuthDataProvider,
    private firebase_plugin: Firebase,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
  ) {
    this.loop();
    firebase.auth().onAuthStateChanged(user => {
      this.onAuthStateChangedCalled = true;
      if (user) {
        this._id = user.uid;
        this.authData.isAuth = true;
        this.authData.user_firebase = user;
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
          authData.idToken = idToken;
        }).catch(function (error) {
          console.error("cannot get token", error);
        });
        this._id = user.uid;
        this.authData.isAuth = true;
      } else {
        this.authData.isAuth = false;
      }
    });

    translate.setDefaultLang('english');
  }

  loop() {
    setTimeout(() => {



    
     

      if (this.onAuthStateChangedCalled) {
        this.track.setUserId(this._id );
        this.platform.ready().then(() => {
          if (this.platform.is("cordova")) {
            this.codePush.checkForUpdate().then(data => {

                this.splashScreen.show();
                const downloadProgress = (progress) => {
                   console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
                  }
                this.codePush.sync({}, downloadProgress).subscribe((syncStatus) => console.log(syncStatus)); 
            })
          }
        })
        this.continue_after_check_update()
      } else {
        this.loop();
      }
    }, 1000 * 2)
  }

  continue_after_check_update(){
    if (this.authData.isAuth) {
      this.authData.getProfileFromServer(this._id).then((user: Profile) => {
        user.countryData.country = user.countryData.country.toLowerCase().replace(" ", "-");
        this.authData.user = user;
        if (user.verifyData.is_phone_number_verified) {
          this.global.initialProviders().then(() => {
            this.platform.ready().then(() => {
              this.initial_app_when_login();
            })
          })
        } else {
          this.platform.ready().then(() => {
            this.rootPage = "enter-phone";
          })
        }


      })
        .catch((err) => {
          console.log("err this.authData.getProfileFromServer app commponnent");
          this.rootPage = "onboarding";
        })
    } else {
      this.initial_app_when_log_out();
    }
  }

  initial_app_when_login() {
    console.log("initial_app_when_login avi1");

    if (!this.platform.is("cordova")) {
      this.authData.platform = "browser";
    } else if (this.platform.is("android")) {
      this.authData.platform = "android";
    } else if (this.platform.is("ios")) {
      this.authData.platform = "ios";
    }
    

  
    this.authData.isFinishRegistration = true;
    if (!this.platform.is("cordova")) {
      this.rootPage = "main-tabs";
      return;
    }

    let toast = this.toastCtrl.create({
      message: this.authData.user.provider + ' Sign in was successful',
      duration: 2000,
      position: 'bottom'
    });
    this.rootPage = "default-page";
    this.statusBar.styleDefault();
    console.log("this.splashScreen.hide()");
    
    this.splashScreen.hide();
    
    toast.present()
   
    this.firebase_plugin.onNotificationOpen().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };
    });
    
    var x = this.authData.user.token_notification;



    if (x == undefined || x == null || x === '') {
      
      this.firebase_plugin.getToken().then(token => {
        this.authData.updateFields({
          token_notification: token
        }).then(() => {
          console.log("token_notification updated");
        })
          .catch(() => {
            console.log("token_notification field to update");
          })
      }).catch((err) => {
        console.log("errrrr", err);

      })
    }

    this.firebase_plugin.onTokenRefresh().subscribe(token => {
      this.authData.updateFields({
        token_notification: token
      }).then(() => {
        console.log("token_notification updated");

      })
        .catch(() => {
          console.log("token_notification field to update");
        })
    });
  }

  initial_app_when_log_out() {
    if (!this.platform.is("cordova")) {
      this.authData.platform = "browser";
    } else if (this.platform.is("android")) {
      this.authData.platform = "android";
    } else if (this.platform.is("ios")) {
      this.authData.platform = "ios";
    }
    if (!this.platform.is("cordova")) {
      // ionic serve
      this.rootPage = "onboarding";
      return;
    }
    this.platform.ready().then(() => {
      this.storage.get('first_time').then((val) => {
        if (val !== null) {
          this.rootPage = "onboarding";
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        } else {
          this.storage.set('first_time', 'done');
          this.statusBar.styleDefault();
          this.splashScreen.hide();
          this.rootPage = "main-tabs";
        }
      });
    })
  }


}

