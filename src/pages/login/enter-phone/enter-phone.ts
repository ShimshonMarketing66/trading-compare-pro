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
      if ( this.authData.user.full_name !== '' ||  this.authData.user.full_name != undefined || this.authData.user.full_name != null) {
        this.authData.user.nickname = this.authData.user.full_name.split(" ")[0];
      }else if (this.authData.user.email !== '' ||  this.authData.user.email != undefined || this.authData.user.email != null){
        this.authData.user.nickname = this.authData.user.email.split("@")[0];
      }
      
      if ( this.authData.user_firebase.phoneNumber !== '' ||  this.authData.user_firebase.phoneNumber != undefined || this.authData.user_firebase.phoneNumber != null) {
        this.authData.user.phone_number = this.authData.user_firebase.phoneNumber;
      }
      
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
console.log(this.authData.user);

   
    if (this.authData.user.countryData.dial_code === '') {
      this.error = "*Please enter Correct Dial Code.";
      return;
    }
    if (this.authData.user.phone_number === ''|| this.authData.user.phone_number == null || this.authData.user.phone_number.length < 5) {
      this.error = "*Please enter Correct Phone Number.";
      return;
    }

    if (this.authData.user.nickname === '') {
      this.error = "*Please enter Correct Usrename.";
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
           
            this.authData.is_nickname_exist(this.authData.user.nickname,true).then(d=>{
              if (d) {
                this.error = "*Username exists already."
                loading.dismiss();
                return ;
              }

              this.authData.sendVerifyCode(loading).then(()=>{
                this.authData.updateFields({phone_number : this.authData.user.phone_number,nickname : this.authData.user.nickname})
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
goto(){
  console.log("asd");
  
  this.navCtrl.push('verify-code')
}
}