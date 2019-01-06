import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalProvider } from '../../providers/global/global';
import { TrackProvider } from '../../providers/track/track';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppRate } from '@ionic-native/app-rate';

@IonicPage({
  name: "menu"
})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor( 
    private appRate: AppRate,
    public socialSharing:SocialSharing,
    public track:TrackProvider,
    public globalProvider:GlobalProvider,
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
      this.splashscreen.show();
      window.location.replace("localhost:8080");
      window.location.reload();
    })
  }

  open_sentiment(){
    console.log(this.authData.user);
    
    this.navCtrl.push("sentiments",{user:this.authData.user})
  }

  open_leaderboard(){
    this.navCtrl.push("leaderboard");
  }

  open_livefeeds(){
    this.navCtrl.parent.select(1);
  }

share() {
   this.globalProvider.loading()
   this.socialSharing.share(null, null, null, "https://tradingcompare.page.link/naxz").then(() => {
   this.globalProvider.dismiss_loading()
   })
  }

  open_ratus(){
    this.appRate.preferences.storeAppURL = {
      ios: 'id1406118849',
      android: 'market://details?id=com.tradingcompare.app'
      
    };
    
    this.appRate.navigateToAppStore();
  }

  open_profile(){
      this.navCtrl.push("my-profile")
  }

}
