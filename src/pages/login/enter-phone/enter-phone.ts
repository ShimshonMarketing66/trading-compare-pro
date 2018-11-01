import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';
import { Sim } from '@ionic-native/sim';

@IonicPage({
  name: "enter-phone"
})
@Component({
  selector: 'page-enter-phone',
  templateUrl: 'enter-phone.html',
})
export class EnterPhonePage {
  error: string;
  constructor(
    public loadingCtrl:LoadingController,
    public alertCtrl:AlertController,
    public modalCtrl:ModalController,
    public sim:Sim,
    public authData:AuthDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
      authData.getContry().then(data => {
        this.authData.user.countryData = data;
        if (this.authData.platform == "browser") {
          return;
        }
        this.sim.hasReadPermission().then((info) => {
          if (!info) {
            this.sim.requestReadPermission().then(() => {
              console.log('Permission granted')
              this.sim.getSimInfo().then(
                (info) => {
                  console.log("info", info);
  
                  let a = this.authData.user.countryData.dial_code.length
                  this.authData.user.phone_number = info.phoneNumber.substring(a);
                },
                (err) => {
                  console.log('Unable to get sim info: ', err);
                }
              );
            },
              () => {
                console.log('Permission denied')
              }
            );
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

  presentDialCode(){
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad enter-phone');
  }


  submit(){
    this.error = "";
    if (this.authData.user.phone_number.length < 5) {
      this.error = "*Please enter Correct Phone Number.";
      return;
    }
    
    let alert = this.alertCtrl.create({
      message: "A message will send to you with this phone number.",
      buttons: [
        {
          text: "Accept",
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: "checking data..."
            })
            loading.present();
            this.authData.sendVerifyCode(loading).then(()=>{
              this.authData.updateFields({phone_number : this.authData.user.phone_number})
              loading.dismiss();
              this.navCtrl.push("verify-code");
            })
            .catch((err)=>{
              loading.dismiss();
              let message = "";
              switch (err.status) {
                case "10":
                message = "A message sent to you already. if you not see it please wait the sms arrive or try in 10 minutes";
                  break;
                  case "15":
                message = "The destination number is not in a supported network";
                  break;
                default:
                message = "an error occured plese try letter";
                  break;
              }
              let alert = this.alertCtrl.create({
                message:message,
                buttons: [ {
                  text: "Ok",
                  handler:(()=>{
                    if (err.status == "10") {
                      this.navCtrl.push("verify-code");
                    }
                  })
                }]
              })
              alert.present();
            })
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

}