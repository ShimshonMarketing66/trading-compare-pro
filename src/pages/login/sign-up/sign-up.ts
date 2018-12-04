import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App, ModalController, AlertController } from 'ionic-angular';
import { Profile } from '../../../models/profile-model';
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';
import { Sim } from '@ionic-native/sim';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from '../../../app/app.component';

@IonicPage({
  name: "sign-up"
})
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  error: string = "";

  constructor(
    public alertCtrl:AlertController,
    public splashscreen: SplashScreen,
    public sim: Sim,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authData: AuthDataProvider,
    public loadingCtrl: LoadingController,
    private app: App
  ) {
    authData.getContry().then(data => {
      this.authData.user.countryData = data;
      if (this.authData.platform == "browser") {
        return;
      }
      this.sim.hasReadPermission().then((info) => {
        if (!info) {
       
        } else {
          this.sim.getSimInfo().then(
            (info) => {
              console.log("info", info);
              let a = this.authData.user.countryData.dial_code.length
              this.authData.user.phone_number = info.phoneNumber.substring(a);
            },
            (err) => {
              console.log('Unable to get sim info: ', err);
            }
          )
        }
      })
    })
  }

  loginUserWithProvider(m_provider: string) {
    this.authData.loginUserWithProvider(m_provider).then((user1: any) => {
      this.authData.getProfileFromServer(user1.user.uid)
      .then((user)=>{
        if (user.verifyData.is_phone_number_verified) {
          this.splashscreen.show()
          window.location.reload();
        } else {
          this.app.getRootNavs()[0].setRoot("enter-phone");
        }
      })
      .catch(()=>{
        this.authData.getProfileWithFirebaseUser(user1.user);
        this.authData.keepProfileInServer(this.authData.user)
        .then((data)=>{
          console.log("added in backend");
          this.app.getRootNavs()[0].setRoot("enter-phone");
        })
      })
      
     
    })
      .catch((err) => {
        console.log("err 656721356731 ", err);
      })
  }

  register() {
    if (this.authData.user.full_name === "") {
      this.error = "*Please enter Correct Full Name.";
      return;
    }

    if (this.authData.user.nickname === "") {
      this.error = "*Please enter Correct Username.";
      return;
    }

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(this.authData.user.email).toLowerCase())) {
      this.error = "*Please enter Correct Email.";
      return;
    }
    if (this.authData.user.password.length < 6) {
      this.error = "*Please enter Correct Password (6 characters minimum).";
      return;
    }

    if (this.authData.user.phone_number.length < 5) {
      this.error = "*Please enter Correct Phone Number.";
      return;
    }
    if (this.authData.user.countryData.country === "") {
      this.error = "*Please select Country.";
      return;
    }
    if (this.authData.user.countryData.dial_code === "") {
      this.error = "*Please select Dial Code.";
      return;
    }
    this.error = "";

    let alert = this.alertCtrl.create({
      message: "A message will send to you with this phone number.",
      buttons: [
        {
          text: "Accept",
          handler: () => {
            this.loginUserWithPassword();     
          }
        },
        {
          text: "Cancel",
          role:"cancel"
        }
      ]
    });
    alert.present()
   
  }


  async loginUserWithPassword() {
    let loading = this.loadingCtrl.create({
      content: "checking data..."
    })
    loading.present();
    let d = await this.authData.is_nickname_exist(this.authData.user.nickname,false);
    if (d) {
      this.error = "*Username exists already."
      loading.dismiss();
      return ;
    }
    
    this.authData.user.countryData.country = this.authData.user.countryData.country.replace("-"," ").toLocaleLowerCase();
    this.authData.signupUser(this.authData.user, loading).then(() => {
      this.authData.sendVerifyCode(loading).then(() => {
        loading.dismiss();
        this.app.getRootNav().setRoot("verify-code");
      }).catch(err => {
        loading.dismiss();
        let errStr = "error... try later.";
        switch (err["status"]) {
          case "10":
            errStr = "A code is sent to your device already."
            break;
          default:
            break;
        }
        alert(errStr);
      })
    }).catch((err) => {
      alert(err)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPag e');
  }

  presentcountries() {
    let profileModal = this.modalCtrl.create("countriesModal", {
      type: "country"
    });
    profileModal.onDidDismiss(data => {
      if (data != undefined && data.dial_code != undefined) {
        this.authData.user.countryData.dial_code = data.dial_code;
        this.authData.user.countryData.country = data.name;
      }
    });
    profileModal.present();
  }

  presentDialCode() {
    let profileModal = this.modalCtrl.create("countriesModal", {
      type: "dial_code"
    });
    profileModal.onDidDismiss(data => {
      if (data != undefined && data.dial_code != undefined) {
        this.authData.user.countryData.dial_code = data.dial_code
      }
    });
    profileModal.present();
  }

  presentbrokerlist() {
    let profileModal = this.modalCtrl.create("brokers-modal");
    profileModal.onDidDismiss(data => {
      if (data != undefined && data.name != undefined) {
        this.authData.user.broker = data.name;
      }
    });
    profileModal.present();
  }

  ionViewDidEnter() {
    if (this.authData.user.email != "") {
      this.authData.user.email = this.authData.user.email;
    }
    if (this.authData.user.password != "") {
      this.authData.user.password = this.authData.user.password;
    }
  }
}
