import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../../models/profile-model';
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';



@IonicPage({
  name:"sign-up"
})
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public profile: Profile,public authData:AuthDataProvider) {
  }


  loginUserWithProvider(m_provider: string) {
    this.authData.loginUserWithProvider(m_provider).then((data)=>{
      console.log(data);
      
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

}
