import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController, App } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';
import { SplashScreen } from '@ionic-native/splash-screen';

declare var SMSReceive: any;

@IonicPage({
  name: "verify-code"
})
@Component({
  selector: 'page-verify-code',
  templateUrl: 'verify-code.html',
})
export class VerifyCodePage {
  @ViewChild("otp1") otp1: any;
  @ViewChild("otp2") otp2: any;
  @ViewChild("otp3") otp3: any;
  @ViewChild("otp4") otp4: any;

  otp1tmp: string = "";
  otp2tmp: string = "";
  otp3tmp: string = "";
  otp4tmp: string = "";

  isSetedFocusForFirstTime: boolean = false;
  canSubmit: boolean = false;
  constructor(
    public app:App,
    public splashscreen: SplashScreen,
    private toastCtrl: ToastController,
    public authData: AuthDataProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public androidPermissions: AndroidPermissions,
    public navCtrl: NavController,
    public navParams: NavParams) {
    platform.ready().then(() => {
      if (platform.is("cordova")) {
        if (platform.is("ios")) {
          this.ReadSMSList();
        } else { // android

          this.checkPermission();
        }
      }
    })
  }


  keyup2(code, ec: KeyboardEvent) {
    var keyCode = ec.keyCode;
    console.log(keyCode, code);

    switch (code) {
      case "1":
        if (keyCode == 8) {
          break;
        }
        if (this.otp1.value.length == 2) {
          this.otp2.value = this.otp1.value.charAt(1);
          this.otp1.value = this.otp1.value.charAt(0);
          this.otp3.setFocus();
        } else {
          this.otp1tmp = this.otp1.value;
          this.otp2.setFocus();
        }
        break;

      case "2":
        if (keyCode == 8) {
          if (this.otp2tmp == "") {
            this.otp1.setFocus();
          } else {
            this.otp2tmp = "";
          }
          break;
        }

        if (this.otp2.value.length == 2) {
          this.otp3.value = this.otp2.value.charAt(1);
          this.otp2.value = this.otp2.value.charAt(0);
          this.otp3.setFocus();
        } else {
          this.otp2tmp = this.otp2.value;
          this.otp3.setFocus();
        }
        break;

      case "3":
        if (keyCode == 8) {
          if (this.otp3tmp == "") {
            this.otp2.setFocus();
          } else {
            this.otp3tmp = "";
          }
          break;
        }

        if (this.otp3.value.length == 2) {
          this.otp4.value = this.otp3.value.charAt(1);
          this.otp3.value = this.otp3.value.charAt(0);
          this.otp4.setFocus();
        } else {
          this.otp3tmp = this.otp3.value;
          this.otp4.setFocus();
        }
        break;

      case "4":

        if (keyCode == 8) {
          if (this.otp4tmp == "") {
            this.otp3.setFocus();
          } else {
            this.otp4tmp = "";
          }
          this.otp4.value = "";
          break;
        }
        this.otp4tmp = this.otp4.value;
        if (this.checkSubmit()) {
          this.submit();
        }

        return;

      default:
        break;
    }
    this.checkSubmit();
  }

  checkSubmit(): boolean {
    if (this.isValid(this.otp1) && this.isValid(this.otp2) && this.isValid(this.otp3) && this.isValid(this.otp4)) {
      this.canSubmit = true;
      return true;
    } else {
      this.canSubmit = false;
      return false;
    }
  }

  isValid(a: any): boolean {
    if (a != undefined) {
      if (a.value != undefined) {
        if (a.value.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  submit() {
    var code = this.otp1.value + this.otp2.value + this.otp3.value + this.otp4.value;
    let loading = this.loadingCtrl.create({
      content: "verifing code..."
    })
    loading.present();
    this.authData.checkCode(code).then(isCheckedCode => {
      if (isCheckedCode) {
        loading.setContent("code is validated succesfully...");
        setTimeout(() => {
          loading.setContent("wait please...");
          setTimeout(() => {
            this.splashscreen.show();
            window.location.replace("localhost:8080");
            window.location.reload();
          }, 2000)
        }, 2000)
      } else {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'The code you enter is wrong',
          duration: 3000,
          position: 'bottom'
        });
        this.canSubmit = false;
        toast.present();
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyCodePage');
  }

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
    .then(success => {
          //if permission granted
          console.log("permited");
          this.ReadSMSList();
        },
        err => {
          console.log("not permited");
          
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
          .then(success => {
              this.ReadSMSList();
            },
              err => {
                alert("cancelled")
              });
        });
  }

  ReadSMSList() {
    SMSReceive.startWatch(() => {
      console.log('smsreceive: watching started');
      document.addEventListener('onSMSArrive', (e: any) => {
        var sms = e.data;
        console.log(sms);
        let code = "";
        if (sms.body.indexOf("Trading Compare code") > -1) {
          code = sms.body.slice(22, 26);
          this.otp1.value = code.charAt(0);
          this.otp2.value = code.charAt(1);
          this.otp3.value = code.charAt(2);
          this.otp4.value = code.charAt(3);
          SMSReceive.stopWatch(() => {
            console.log("SMSReceive.stopWatch");
          })
          this.submit();
        }
      });
    }, function () {
      console.warn('smsreceive: failed to start watching');
    });

    // setInterval(()=>{
    //   let filter = {
    //     box : 'inbox', // 'inbox' (default), 'sent', 'draft'
    //     indexFrom : 0, // start from index 0
    //     maxCount : 10, // count of SMS to return each time
    //          };
  
    //     if(SMS) SMS.listSMS(filter, (ListSms)=>{
  
    //         console.log("Sms",ListSms);
    //        },
  
    //        Error=>{
    //        console.log('error list sms: ' + Error);
    //        }); 
    // },5000)
  }

}
