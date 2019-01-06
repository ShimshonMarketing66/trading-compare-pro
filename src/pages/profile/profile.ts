import { Component, trigger, transition, animate, keyframes, style } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { GlobalProvider } from '../../providers/global/global';
import { TrackProvider } from '../../providers/track/track';


@IonicPage({
  name: "profile"
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [
    trigger("changeBackgroundColor", [
      transition("falling1 => falling, falling => falling1,raising => falling,raising => falling1,raising1 => falling,raising1 => falling1,none => falling,none => falling1",
        [
          animate("0.6s",
            keyframes([
              style({ color: "#e34c47", offset: 0 }),
              style({ backgroundColor: "#e34c47", offset: 0, opacity: 0.5 }),
              style({ backgroundColor: "#2b2b2b", offset: 1 })
            ])
          )]
      ),
      transition("raising1 => raising, raising => raising1,falling => raising,falling => raising1,falling1 => raising,falling1 => raising1,none => raising1,none => raising",
        [
          animate("0.6s",
            keyframes([
              style({ backgroundColor: "#91c353", opacity: 0.5 }),
              style({ backgroundColor: "#2b2b2b", })
            ])
          )]
      )
    ])
  ]
})
export class ProfilePage {
  profile_country;
  posts_length = 0;
  posts: any[] = [];
  is_follow = false;
  selected_segment = "POSTS";
  profile: any
  watchlist_length: number = 0;
  followers_length = 0;
  following_length = 0;

  constructor(
    public viewCtrl:ViewController, 
    public track:TrackProvider,
    public authData: AuthDataProvider,
    public globalProvider: GlobalProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.track.log_screen("profile");
    this.globalProvider.loading("get user profile");
    var a = this.navParams.get("user");
    console.log("a", a._id);

    this.profile_country = a.country;

    if (this.globalProvider.isAuth()) {
      for (let index = 0; index < this.globalProvider.my_following.length; index++) {
        if (a._id == this.globalProvider.my_following[index]._id) {
          this.is_follow = true;
        }
      }
    }


    this.check_done();


    this.globalProvider.get_all_information(a._id).then((data) => {
      console.log(data);
      
      this.profile = data;
      this.posts_length = this.profile.posts.length;
      this.watchlist_length = this.profile.watchlist.length;
      this.followers_length = this.profile.followers.length;
      this.following_length = this.profile.following.length;

      if (!this.globalProvider.isAuth()) {
        this.globalProvider.dismiss_loading();
        return;
      }

      for (let index = 0; index < this.profile.followers.length; index++) {
        for (let j = 0; j < this.globalProvider.my_following.length; j++) {
          if (this.globalProvider.my_following[j]._id == this.profile.followers[index]._id) {
            this.profile.followers[index]["is_in_my_following"] = true;
          }
        }
      }

      for (let index = 0; index < this.profile.following.length; index++) {
        for (let j = 0; j < this.globalProvider.my_following.length; j++) {
          if (this.globalProvider.my_following[j]._id == this.profile.following[index]._id) {
            this.profile.following[index]["is_in_my_following"] = true;
          }
        }
      }
      this.check_done();
    })
  }
  counter_promises_returned: number = 0;
  check_done() {
    this.counter_promises_returned += 1;
    if (this.counter_promises_returned == 2) {
      this.globalProvider.dismiss_loading();
    }
  }



  foo() {

    console.log(this.authData);

  }

  change_segment(segment) {
    this.selected_segment = segment;
  }

  goToDetails(watchlist: any) {
    let page: string = ""
    switch (watchlist.type) {
      case "STOCK":
        page = "item-details-stock";
        break;
      case "FOREX":
        page = "item-details-forex";
        break;
      case "CRYPTO":
        page = "item-details-crypto";
        break;

      default:
        break;
    }

    this.navCtrl.push(page, {
      item: watchlist,
    })
  }

  add_follow() {
    if (!this.globalProvider.isAuth()) {
      this.globalProvider.open_login_alert(this.viewCtrl);
      return;
    }
    this.is_follow = true;
    this.followers_length += 1;

    this.globalProvider.my_following.push({
      _id: this.profile._id,
      nickname: this.profile.nickname,
      country: this.profile_country
    })

    var follow = {
      id_following: this.authData.user._id,
      id_followed: this.profile._id,
      nickname_following: this.authData.user.nickname,
      nickname_followed: this.profile.nickname,
      country_following: this.authData.user.countryData.country,
      country_followed: this.profile_country,
    }
    this.authData.add_follow(follow)
  }

  remove_follow() {
    if (!this.globalProvider.isAuth()) {
      this.globalProvider.open_login_alert();
      return;
    }
    this.followers_length -= 1;
    this.is_follow = false;
    var follow = {
      id_following: this.authData.user._id,
      id_followed: this.profile._id,
    }

    for (let index = 0; index < this.globalProvider.my_following.length; index++) {
      if (this.globalProvider.my_following[index]._id == this.profile._id) {
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

  go_to_comment(comment) {
    let page: string = ""    
    if (comment.symbol == "all") {
      page = "all-chat";
    }else{
      let a = this.globalProvider.get_symbol_type(comment.symbol)
      console.log(a);
    

    switch (a) {
      case "STOCK":
        page = "item-details-stock";
        break;
      case "FOREX":
        page = "item-details-forex";
        break;
      case "CRYPTO":
        page = "item-details-crypto";
        break;

      default:
        break;
    }
  }
    this.navCtrl.pop({ animate: false });
    this.navCtrl.push(page, {
      primary_key: comment.primary_key,
      symbol: comment.symbol
    })

  }

  go_to_profile(user) {
    this.navCtrl.pop({ animate: false });
    if (user._id == this.authData.user._id) {
      this.navCtrl.push('my-profile');
    } else {
      this.navCtrl.push('profile', { user: user });
    }
  }

  go_to_sentiment() {
    this.navCtrl.push("sentiments", {
      user: this.profile
    });
  }




}
