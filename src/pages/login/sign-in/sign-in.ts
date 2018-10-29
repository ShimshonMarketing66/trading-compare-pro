import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../../models/profile-model';

@IonicPage({
  name: "sign-in"
})
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {
  email:string = "";
  password:string = "";
  error: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   
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
    
    this.authdata.loginUserViaEmail(this.profile.email,this.profile.password).then((user) => {
        console.log(user,"user");
        this.authdata.checkIfUserExistAlready(user.uid).then(profile=>{
          console.log(profile,"profile");
          this.authdata.user=profile
          if(profile.is_phone_number_verified)
          this.navCtrl.setRoot("main-tabs")
          else
          this.navCtrl.setRoot("verify-phone")

        }).catch((err) => {
          console.log(err.message);
          let alert = this.alertCtrl.create({
            message: err.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        })
          }).catch((err) => {
      console.log(err.message);
      let alert = this.alertCtrl.create({
        message: err.message,
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
}
