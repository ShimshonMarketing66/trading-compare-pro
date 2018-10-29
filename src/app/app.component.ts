import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { TranslateService } from '@ngx-translate/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AngularFireAuth } from '@angular/fire/auth';
import { MainTabsPage } from '../pages/main-tabs/main-tabs';
import firebase from 'firebase';
import { Sim } from '@ionic-native/sim';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any = "login-tabs";
  isLogin: boolean;
  onAuthStateChangedCalled: boolean = false;



  constructor(
    private sim: Sim,
    private afAuth: AngularFireAuth,
    private androidPermissions: AndroidPermissions,
    private fcm: FCM,
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public translate: TranslateService,
  ) {
    // this.loop();
    // this.afAuth.auth.onAuthStateChanged(user => {
    //   this.onAuthStateChangedCalled = true;
    //   if (user) {
    //     this.isLogin = true;
    //   } else {
    //     this.isLogin = false;

    //   }
    //   platform.ready().then(() => {

    //     if (platform.is("cordova")) {
    //       statusBar.styleDefault();
    //       splashScreen.hide();
    //       if (!this.isLogin) {
    //         this.checkPermission();
    //       }

    //       if (this.isLogin) {
    //         this.fcm.getToken().then(token => {
    //           console.log("getToken", token);
    //         });

    //         this.fcm.onNotification().subscribe(data => {
    //           console.log(data);

    //           if (data.wasTapped) {
    //             console.log("Received in background");
    //           } else {
    //             console.log("Received in foreground");
    //           };
    //         });

    //         this.fcm.onTokenRefresh().subscribe(token => {
    //           console.log("onTokenRefresh", token);
    //         });
    //       }
    //     }
    //   });

    // });

          platform.ready().then(() => {
         
          })


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
          this.rootPage = "main-tabs";
        } else {
          this.rootPage = "login-tabs";
        }
      } else {
        this.loop();
      }
    }, 1000 * 2)
  }
}

