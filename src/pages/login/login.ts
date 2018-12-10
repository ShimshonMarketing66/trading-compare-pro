import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TrackProvider } from '../../providers/track/track';


@IonicPage({
  name:"login-tabs"
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  signInRoot = "sign-in";
  signUpRoot = "sign-up";

  constructor( public track:TrackProvider,public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage tabs');
  }

}
