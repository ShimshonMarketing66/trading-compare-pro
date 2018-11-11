import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from '../../app/app.component';

declare var navigator:any;
@IonicPage({
  name: "menu"
})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor(
    public app:App,
    public splashscreen:SplashScreen,
    public authData: AuthDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  logout() {
    this.authData.logoutUser().then(() => {
      // navigator.navigateTo('http://www.google.com');

    })
  }

}
