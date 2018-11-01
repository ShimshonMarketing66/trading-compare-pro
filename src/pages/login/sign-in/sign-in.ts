import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, Tabs } from 'ionic-angular';
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from '../../../app/app.component';
import { Profile } from '../../../models/profile-model';

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
    public app: App,
    public splashscreen: SplashScreen,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authData: AuthDataProvider) {

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

    console.log("done");

    this.authData.loginUserViaEmail(this.email, this.password).then((user) => {
      console.log(user, "user");
      this.authData.getProfileFromServer(user.user.uid)
        .then((data) => {
          if (data.verifyData.is_phone_number_verified) {
            this.splashscreen.show();
            window.location.reload();
            this.app.getRootNav().setRoot(MyApp);
          } else {
            let alert = this.alertCtrl.create({
              message: "need to complete registration",
              buttons: [
                {
                  text: "complete registration",
                  role: 'cancel',
                  handler: () => {
                    this.navCtrl.setRoot("verify-code");
                  }

                }
              ]
            });
            alert.present();
          }
        })
        .catch(err => {
          console.log("aaa");
          this.authData.deleteProfile(user.user.uid).then(()=>{
            console.log("user deleted");
            let alert = this.alertCtrl.create({
              message: "Sorry, please complet registretion.",
              buttons: [
                {
                  text: "complete registration",
                  role: 'cancel',
                  handler: () => {
                    this.authData.user.password = this.password;
                    this.authData.user.email = this.email;
                    this.navCtrl.parent.select(0);                  }
                }
              ]
            });
            alert.present();
          }).catch((err)=>{
            console.log("err123334", err);
          })
          console.log("err", err);
        })
    }).catch((err) => {
      console.log(err);
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


  loginUserWithProvider(m_provider: string) {
    this.authData.loginUserWithProvider(m_provider).then((user: Profile) => {
      if (user.verifyData.is_phone_number_verified) {
        this.splashscreen.show();
        this.app.getRootNavs()[0].setRoot(MyApp).then(() => {
          window.location.reload();
        })
      } else {
        this.app.getRootNavs()[0].setRoot("enter-phone");
      }
    })
      .catch((err) => {
        console.log("err 656721356731 ", err);
      })
  }
}
