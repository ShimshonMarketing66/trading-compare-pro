import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { GlobalProvider } from '../../providers/global/global';



@IonicPage({
  name:"leaderboard"
})
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {
  users: any[] = [];

  constructor(
    public globalProvider:GlobalProvider,
    public authData:AuthDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams
    ) {
      this.users = this.navParams.get("all_user");      
      if (this.users === undefined) {
        this.globalProvider.get_sentiments_users().then((data)=>{
          this.users = data;
        })
      }
      
  }

  ionViewDidLoad() {
    
  }
  go_to_user_page(user){
    if (user._id == this.authData.user._id) {
      this.navCtrl.push('my-profile')
    }else{
      this.navCtrl.push('profile',{user:user})
    }
  }
}
