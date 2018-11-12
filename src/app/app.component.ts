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
    public authData: AuthDataProvider,
    private androidPermissions: AndroidPermissions,
    private fcm: FCM,
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public translate: TranslateService,
  ) {
    this.loop();
    firebase.auth().onAuthStateChanged(user => {
      this.onAuthStateChangedCalled = true;
      if (user) {
        this._id = user.uid;
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }

      platform.ready().then(() => {

        if (!platform.is("cordova")) {
          this.authData.platform = "browser";
        } else if (platform.is("android")) {
          this.authData.platform = "android";
        } else if (platform.is("ios")) {
          this.authData.platform = "ios";
        }
        if (!platform.is("cordova")) {
          return;
        }
        statusBar.styleDefault();
        splashScreen.hide();

        if (this.firstTime) {
          this.firstTime = false;
          return;
        }
        if (!this.isLogin) {
          this.checkPermission();
          return;
        }


        this.fcm.getToken().then(token => {
          console.log("getToken", token);
        });

        this.fcm.onNotification().subscribe(data => {
          console.log(data);

          if (data.wasTapped) {
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
          };
        });

        this.fcm.onTokenRefresh().subscribe(token => {
          console.log("onTokenRefresh", token);
        });
      });
    });
    translate.setDefaultLang('english');

  }


  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
      .then(() => {
        console.log("permited");
      },
        err => {
          console.log("not permited");

          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
            .then(() => {
              console.log("permited");
            },
              err => {
                alert("cancelled")
              });
        });
  }


  loop() {
    setTimeout(() => {
      if (this.onAuthStateChangedCalled) {
        if (this.isLogin) {
          this.authData.getProfileFromServer(this._id).then((user:Profile) => {
            this.authData.user = user;
            if (user.verifyData.is_phone_number_verified) {
              this.rootPage = "main-tabs";
            }else{
              this.rootPage = "enter-phone";
            }
          })
          .catch((err)=>{
            console.log("err this.authData.getProfileFromServer app commponnent"); 
            this.rootPage = "login-tabs";
          })
        } else {
          this.rootPage = "login-tabs";
        }
      } else {
        this.loop();
      }
    }, 1000 * 2)
  }
}

