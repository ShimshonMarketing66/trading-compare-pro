import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { GlobalProvider } from '../../providers/global/global';
import { TrackProvider } from '../../providers/track/track';



@IonicPage({
  name:"leaderboard"
})
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {
  sentiments_users: any[] = [];
  MODE="SENTIMENTS";
  all_users:any[];
  constructor(
    public track:TrackProvider,
    public globalProvider:GlobalProvider,
    public authData:AuthDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams
    ) {
      track.log_screen("leaderboard");

      this.globalProvider.get_all_users().then((data)=>{
        for (let index = 0; index < data.length; index++) {
          data[index].country =  (data[index].country as string).toLowerCase().replace(" ","-");
          let flag = false;
          for (let j = 0; j < this.globalProvider.my_following.length; j++) {
            if (this.globalProvider.my_following[j]._id==data[index]._id) {
              flag = true;
              break;
            }
           
          }
          data[index]["is_in_my_following"]=flag;
        }
        this.all_users = data;
      })
      this.sentiments_users = this.navParams.get("all_user");      
      if (this.sentiments_users === undefined) {
        this.globalProvider.get_sentiments_users().then((data)=>{
          console.log("datattta" ,data);
          
          this.sentiments_users = data;
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

  remove_follow_other(profile, ev) {
    ev.stopPropagation();
    if (!this.globalProvider.isAuth()) {
      this.globalProvider.open_login_alert();
      return;
    }
    profile["is_in_my_following"] = false;
    var follow = {
      id_following: this.authData.user._id,
      id_followed: profile._id
    }

    for (let index = 0; index < this.globalProvider.my_following.length; index++) {
      if (this.globalProvider.my_following[index]._id == profile._id) {
        this.globalProvider.my_following.splice(index, 1);
      }
    }

    this.authData.remove_follow(follow)
  }

  add_follow_other(profile, ev) {
    ev.stopPropagation();
    if (!this.globalProvider.isAuth()) {
      this.globalProvider.open_login_alert();
      return;
    }
    profile["is_in_my_following"] = true;
    this.globalProvider.my_following.push({
      _id: profile._id,
      nickname: profile.nickname,
      country: profile.country
    })

    var follow = {
      id_following: this.authData.user._id,
      id_followed: profile._id,
      nickname_following: this.authData.user.nickname,
      nickname_followed: profile.nickname,
      country_following: this.authData.user.countryData.country,
      country_followed: profile.country
    }
    this.authData.add_follow(follow);
  }


}
