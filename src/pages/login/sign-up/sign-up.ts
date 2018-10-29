import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App, ModalController } from 'ionic-angular';
import { Profile } from '../../../models/profile-model';
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';
import { Sim } from '@ionic-native/sim';



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
    public sim:Sim,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public profile: Profile,
    public authData: AuthDataProvider,
    public loadingCtrl: LoadingController,
    private app: App
  ) {

    authData.getContry().then(data => {
      profile.countryData = data;      
      if (this.authData.platform == "browser") {
        return;
      }
      this.sim.hasReadPermission().then((info) => {
        if (!info) {
          this.sim.requestReadPermission().then(() => {
            console.log('Permission granted')
            this.sim.getSimInfo().then(
              (info) => {
                console.log("info",info);
                
               let a =  profile.countryData.dial_code.length
               profile.phone_number = info.phoneNumber.substring(a);
              },
              (err) => {
                console.log('Unable to get sim info: ', err);
              }
            );},
            () => {
              console.log('Permission denied')
            }
          );
        }else{
          this.sim.getSimInfo().then(
            (info) => {
              console.log("info",info);
             let a =  profile.countryData.dial_code.length
             profile.phone_number = info.phoneNumber.substring(a);
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
    this.authData.loginUserWithProvider(m_provider).then((data) => {
      console.log(data);
    })
  }

  register() {

    // this.app.getRootNav().setRoot("verify-code");
    // return;
    // this.navCtrl.setRoot("verify-code");
    if (this.profile.first_name == "") {
      this.error = "*Please enter Correct First name.";
      return;
    }

    if (this.profile.last_name == "") {
      this.error = "*Please enter Correct Last name.";
      return;
    }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(this.profile.email).toLowerCase())) {
      this.error = "*Please enter Correct Email.";
      return;
    }
    if (this.profile.password.length < 6) {
      this.error = "*Please enter Correct Password (6 characters minimum).";
      return;
    }

    if (this.profile.phone_number.length < 5) {
      this.error = "*Please enter Correct Phone Number.";
      return;
    }
    if (this.profile.countryData.country == "") {
      this.error = "*Please select Country.";
      return;
    }
    if (this.profile.countryData.dial_code == "") {
      this.error = "*Please select Dial Code.";
      return;
    }
    this.error = "";

    this.loginUserWithPassword();


  }


  loginUserWithPassword() {
    let loading = this.loadingCtrl.create({
      content: "checking data..."
    })
    loading.present();
    this.authData.signupUser(this.profile, loading).then(() => {
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
        this.profile.countryData.dial_code = data.dial_code;
        this.profile.countryData.country = data.name;
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
        this.profile.countryData.dial_code = data.dial_code
      }
    });
    profileModal.present();
  }

  presentbrokerlist() {

    let profileModal = this.modalCtrl.create("brokers-modal");
    profileModal.onDidDismiss(data => {
      if (data != undefined && data.name != undefined) {
        this.profile.broker = data.name
      }
    });
    profileModal.present();
  }

}
