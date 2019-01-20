import { Component, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Platform, Nav, ToastController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { AuthDataProvider } from '../providers/auth-data/auth-data';
import { Profile } from '../models/profile-model';
import { GlobalProvider } from '../providers/global/global';
import { CodePush, InstallMode } from '@ionic-native/code-push';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { TrackProvider } from '../providers/track/track';
import { Appsflyer, AppsflyerOptions } from '@ionic-native/appsflyer';
import { Globalization } from '@ionic-native/globalization';

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
    private globalization: Globalization,
    public app:App,
    private appsflyer: Appsflyer,
    public zone: NgZone,
    public track: TrackProvider,
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
        this.platform.ready().then(() => {
          if (this.platform.is("cordova")) {
            this.track.setUserId(this._id);
         
            const appsflyerOptions: AppsflyerOptions = {
              devKey: "SmETXRWQwsJVhLhWbBBfn",
              onInstallConversionDataListener: true
            }
            if (this.platform.is("ios")) {
              appsflyerOptions.appId = "id1406118849";
            }

            this.appsflyer.initSdk(appsflyerOptions);

            this.statusBar.styleDefault();
            // this.codePush.checkForUpdate().then((data) => {
            //   if (data) {
            //     const downloadProgress = (progress) => {
            //       this.zone.run(() => {
            //         this.global.update_progress = ((Number(progress.receivedBytes) / Number(progress.totalBytes)) * 100).toFixed(0);
            //       })
            //       console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
            //     }
            //     this.codePush.sync({
            //       installMode: InstallMode.IMMEDIATE,
            //       updateDialog: true
            //     }, downloadProgress).subscribe((syncStatus) => {
            //       if (syncStatus == 7) {
            //         this.rootPage = "update-page";
            //       }


            //     });
            //   }
            // })
            this.continue_after_check_update();
            // this.codePush.getCurrentPackage().then((data1)=>{
            //   console.log("getCurrentPackage",data1);
            //   if (data1) {
            //     this.codePush.checkForUpdate().then(data => {
            //       var version=Number(data.label.slice(1,data.label.length));
            //       var curr=Number(data1.label.slice(1,data1.label.length));
            //       console.log("version",version,curr);

            //       if ((version > curr)) {
            //         this.splashScreen.hide();
            //         this.rootPage = "update-page";
            //         const downloadProgress = (progress) => {
            //           this.zone.run(()=>{
            //             this.global.update_progress = ((Number(progress.receivedBytes) / Number(progress.totalBytes)) * 100).toFixed(0);
            //           })

            //           console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
            //         }
            //         this.codePush.sync({}, downloadProgress).subscribe((syncStatus) =>{
            //            console.log("syncStatus",syncStatus);
            //            if (syncStatus == 1) {
            //             // // this.splashScreen.show();
            //             // // this.codePush.restartApplication();
            //             // this.splashScreen.show();
            //             // window.location.replace("localhost:8080");
            //             // window.location.reload();
            //            }
            //            if (syncStatus == 0) {
            //             // this.continue_after_check_update();
            //            }
            //           });
            //       } else {
            //         this.continue_after_check_update();
            //       }
            //     })
            //   }else{
            //     this.continue_after_check_update();
            //   }
            // })

          } else {
            this.continue_after_check_update();
          }
        })

      } else {
        this.loop();
      }
    }, 1000 * 2)
  }

  continue_after_check_update() {
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
            this.splashScreen.hide();
            this.rootPage = "enter-phone";
          })
        }


      })
        .catch((err) => {
          console.log("err this.authData.getProfileFromServer app commponnent");
          this.splashScreen.hide();
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
    this.firebase_plugin.onNotificationOpen().subscribe(data => {
      console.log("onNotificationOpen",data);
     
      if (data.tap) {
        
        console.log("Received in background");
        if (data.symbol != undefined) {
          var page = "";
          if (data.symbol == "all") {
            page = "all-chat";
          }else{
            switch (this.global.get_symbol_type(data.symbol)) {
              case "FOREX":
              page = "item-details-forex";
                break;
                case "STOCK":
                page = "item-details-stock";
                break;
                case "CRYPTO":
                page = "item-details-crypto";
                break;
            
              default:
              page = "all-chat";
                break;
            }
          }
   
          this.global.loading();
          setTimeout(()=>{
            this.global.dismiss_loading();
            this.app.getActiveNavs()[0].push(page,{
              symbol:data.symbol,
              primary_key:data.primary_key,
            });
          },2000)
        }else if(data.user != undefined){
          this.global.loading();
          setTimeout(()=>{
            this.global.dismiss_loading();
            this.app.getActiveNavs()[0].push("profile",{
                user:JSON.parse(data.user)
            });
          },2000)
        }
      } else {
        console.log("Received in foreground");
      };

    });

    this.splashScreen.hide();

    toast.present()

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
      this.global.initialProviders().then(() => {
        this.platform.ready().then(() => {
          this.rootPage = "onboarding";
        })
      })

      return;
    }
    this.platform.ready().then(() => {
      this.storage.get('first_time').then((val) => {
        if (val !== null) {
          this.global.initialProviders().then(() => {
            this.platform.ready().then(() => {
              this.rootPage = "onboarding";
              this.splashScreen.hide();
            })
          })

        } else {

          this.global.initialProviders().then(() => {
            this.platform.ready().then(() => {
              this.storage.set('first_time', 'done');
              this.splashScreen.hide();
              this.rootPage = "main-tabs";
            })
          })
        }
      });
    })
  }


}

