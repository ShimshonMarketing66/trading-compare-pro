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
  all_users:any[]= [];
  most_followed: any[] = [];
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

      this.globalProvider.get_most_followed().then((data)=>{
        for (let index = 0; index < data.length; index++) {
          data[index].country_followed =  (data[index].country_followed as string).toLowerCase().replace(" ","-");
          let flag = false;
          for (let j = 0; j < this.globalProvider.my_following.length; j++) {
            if (this.globalProvider.my_following[j]._id==data[index].user_followed) {
              flag = true;
              break;
            }
           
          }
          data[index]["is_in_my_following"]=flag;
        }
        this.most_followed = data;
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
    if (user._id == this.authData.user._id || user.user_followed == this.authData.user._id) {
      this.navCtrl.push('my-profile')
    }else{
      if (user._id==undefined) {
        user["_id"] = user.user_followed;
        user["country"] = user.country_followed;
        user["nickname"] = user.nickname_followed;
      }
      
      this.navCtrl.push('profile',{user:user})
    }
  }

  remove_follow_other(profile, ev) {
    ev.stopPropagation();
    if (!this.globalProvider.isAuth()) {
      this.globalProvider.open_login_alert();
      return;
    }
    let a =  profile._id != undefined?profile._id:profile.user_followed
    profile["is_in_my_following"] = false;
    var follow = {
      id_following: this.authData.user._id,
      id_followed: a
    }

    for (let index = 0; index < this.globalProvider.my_following.length; index++) {
      if (this.globalProvider.my_following[index]._id == a) {
        this.globalProvider.my_following.splice(index, 1);
      }
    }

    for (let index = 0; index < this.all_users.length; index++) {
      if (this.all_users[index]._id == a) {
        this.all_users[index]["is_in_my_following"] = false;
      }
    }

    for (let index = 0; index < this.most_followed.length; index++) {
      if (this.most_followed[index].user_followed == a) {
        this.most_followed[index]["is_in_my_following"] = false;
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
    let _id = profile._id != undefined?profile._id:profile.user_followed
    let nickname=profile.nickname != undefined?profile.nickname:profile.nickname_followed
    let country=profile.country != undefined?profile.country:profile.country_followed

    this.globalProvider.my_following.push({
      _id: _id,
      nickname: nickname,
      country: country
    })

    this.globalProvider.my_following.push({
      _id: _id,
      nickname: nickname,
      country: country
    })

    for (let index = 0; index < this.all_users.length; index++) {
      if (this.all_users[index]._id == _id) {
        this.all_users[index]["is_in_my_following"] = true;
      }
    }

    for (let index = 0; index < this.most_followed.length; index++) {
      if (this.most_followed[index].user_followed == _id) {
        this.most_followed[index]["is_in_my_following"] = true;
      }
    }



    var follow = {
      id_following: this.authData.user._id,
      id_followed: _id,
      nickname_following: this.authData.user.nickname,
      nickname_followed: nickname,
      country_following: this.authData.user.countryData.country,
      country_followed: country
    }
    this.authData.add_follow(follow);
  }


}
