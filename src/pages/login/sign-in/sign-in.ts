import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, Tabs, ViewController, LoadingController, Loading } from 'ionic-angular';
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from '../../../app/app.component';
import { Profile } from '../../../models/profile-model';
import { TrackProvider } from '../../../providers/track/track';

@IonicPage({
  name: "sign-in"
})
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {
  email: string = "";
  password: string = "";
  error: string = "";
  constructor(
    public loadingCtrl:LoadingController,
    public viewCtrl: ViewController,
    public track: TrackProvider,
    public app: App,
    public splashscreen: SplashScreen,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authData: AuthDataProvider) {
      this.track.log_screen("sign-in");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }


  signin() {
    
    this.error = ""
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(this.email).toLowerCase())) {
      this.error = "*Please enter Correct Email.";
      return;
    }

    if (this.password.length < 6) {
      this.error = "*Please enter Correct Password (6 characters minimum).";
      return;
    }
    let loading = this.loadingCtrl.create({
      content:"login with password"
    })
    loading.present();
    this.authData.loginUserViaEmail(this.email, this.password).then((user) => {
      console.log(user);
      loading.present();
      this.after_get_firebase_id(user.uid,undefined,loading)

    }).catch((err) => {
      let message = ""
      switch (err.code) {
        case "auth/user-not-found":
          message = "this email is not exist."
          break;
        case "auth/wrong-password":
          message = "wrong password."
        default:
          message = "check the email or the password.";
          break;
      }
      let alert = this.alertCtrl.create({
        message: message,
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present();
    })
  }

  after_get_firebase_id(user: any,m_provider?:string,loading?:Loading) {
    console.log(user.uid, "_id");
    this.authData.getProfileFromServer(user.uid)
      .then((data) => {
        loading.dismiss();
        if (data == undefined) {
          return;
        }
        if (data.verifyData.is_phone_number_verified) {
          this.splashscreen.show();
          this.navCtrl.push("main-tabs").then(() => {
            window.location.replace("localhost:8080/");
            window.location.reload();
            const index = this.viewCtrl.index;
            this.navCtrl.remove(index);
          });
        } else {
          let alert = this.alertCtrl.create({
            message: "Please fill in all fields to complete registration",
            buttons: [
              {
                text: "Complete",
                handler: () => {
                  this.navCtrl.push("enter-phone");
                }
              }
            ]
          });
          alert.present();
        }
      })
      .catch(err => {
        loading.dismiss();
        console.log("user1",user);
        this.authData.getProfileWithFirebaseUser(user);
        this.authData.user.provider = m_provider;
        this.authData.createUser(this.authData.user)
        .then(()=>{
          console.log("added in backend");
          this.app.getRootNavs()[0].setRoot("enter-phone");
        })
        console.log("err", err);
      })
  }

  loginUserWithProvider(m_provider: string) {
    let loading = this.loadingCtrl.create({
      content:"login with "+m_provider
    })
    loading.present();
    this.authData.loginUserWithProvider(m_provider).then((user: any) => {
      console.log(user);

      this.after_get_firebase_id(user,m_provider,loading);
    })
      .catch((err) => {
        console.log("err 656721356731 ", err);
      })
  }
}
