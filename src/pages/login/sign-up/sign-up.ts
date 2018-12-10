import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App, ModalController, AlertController, ViewController } from 'ionic-angular';
import { Profile } from '../../../models/profile-model';
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';
import { Sim } from '@ionic-native/sim';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from '../../../app/app.component';
import { AndroidPermissions } from '@ionic-native/android-permissions';

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
    public viewCtrl:ViewController,
    private androidPermissions: AndroidPermissions,
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
    
    let loading = this.loadingCtrl.create({
      content:"login via " + m_provider + "..."
    })
    loading.present()
    this.authData.loginUserWithProvider(m_provider).then((user1: any) => {
      loading.setContent("retrieving data...");
      console.log(user1);
      this.authData.getProfileFromServer(user1.uid)
      .then((user)=>{
        loading.setContent("checking data...");
        setTimeout(() => {
          loading.dismiss();
          if (user.verifyData.is_phone_number_verified) {
            this.splashscreen.show();
           
            this.navCtrl
      .push("main-tabs")
      .then(() => {
        window.location.replace("localhost:8080/");
        window.location.reload();
        // first we find the index of the current view controller:
        const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
      });
          } else {
            this.app.getRootNavs()[0].setRoot("enter-phone");
          }
        }, 2000);
      })
      .catch(()=>{
        this.authData.getProfileWithFirebaseUser(user1.user);
        loading.setContent("create user...");
        this.authData.createUser(this.authData.user)
        .then(()=>{
          loading.dismiss();
          console.log("added in backend");
          this.app.getRootNavs()[0].setRoot("enter-phone");
        })
      })
      
     
    })
      .catch((err) => {
        loading.dismiss();
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

  async checkPermission() {
    await this.checkPermissionREAD_SMS();
    await this.checkPermissionSim();

  }
  checkPermissionREAD_SMS(): Promise<any> {
    return new Promise((resolve) => {
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

  checkPermissionSim() : Promise<any> {
    return new Promise((resolve)=>{
      this.sim.hasReadPermission().then((info) => {
        if (!info) {
          this.sim.requestReadPermission().then(() => {
            console.log('Permission granted')
            this.sim.getSimInfo().then(
              (info) => {
                console.log("info", info);
                resolve();
              },
              (err) => {
                console.log('Unable to get sim info: ', err);
                resolve();
              });
          },
            () => {
              console.log('Permission denied');
              resolve();
            }
          );
        }
        resolve();
      })
    })
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
    let a = this.authData.user.countryData.country.split(",")[0];
    this.authData.user.countryData.country = a.replace(" ","-").toLocaleLowerCase();

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
