import { Component, trigger, transition, animate, keyframes, style } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { GlobalProvider } from '../../providers/global/global';


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
  posts_length=0;
  posts: any[] = [];
  is_follow = false;
  selected_segment = "POSTS";
  profile:any
  watchlist_length: number = 0;
  followers_length=0;
  following_length= 0;

  constructor(
    public authData: AuthDataProvider,
    public globalProvider: GlobalProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    ) {
    this.globalProvider.loading("get user profile");
    var a = this.navParams.get("user");
    this.profile_country = a.country;

      for (let index = 0; index < this.globalProvider.my_following.length; index++) {
        if (a._id == this.globalProvider.my_following[index]._id) {
          this.is_follow = true;
        }
      }
      this.check_done();


    this.globalProvider.get_all_information(a._id).then((data)=>{
    this.profile = data;
    console.log(data);
    
    this.posts_length =  this.profile.posts.length;
    this.watchlist_length = this.profile.watchlist.length;
    this.followers_length = this.profile.followers.length;
    this.following_length = this.profile.following.length;

    
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
        this.profile.followers[index]["is_in_my_following"] = true;
       }
      }
    }
     this.check_done();
    })
  }
  counter_promises_returned:number = 0;
  check_done(){
    this.counter_promises_returned +=1;
    if (this.counter_promises_returned == 2) {
      this.globalProvider.dismiss_loading()
    }
  }

  ionViewDidLoad() {

  }

  foo() {
    console.log(this.globalProvider.watchlists);
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

  add_follow(){
    this.is_follow = true;
    this.following_length += 1;

    this.globalProvider.my_following.push({
      _id:this.profile._id,
      nickname:this.profile.nickname,
      country:this.profile_country
    })

    var follow = {
      id_following:this.authData.user._id,
      id_followed:this.profile._id,
      nickname_following:this.authData.user.nickname,
      nickname_followed :this.profile.nickname,
      country_following :this.authData.user.countryData.country,
      country_followed :this.profile_country,
    }
    this.authData.add_follow(follow)
  }

  remove_follow(){
    this.following_length -= 1;
    this.is_follow = false;
    var follow = {
      id_following:this.authData.user._id,
      id_followed:this.profile._id,
    }

    for (let index = 0; index < this.globalProvider.my_following.length; index++) {
      if (this.globalProvider.my_following[index]._id == this.profile._id) {
        this.globalProvider.my_following.splice(index,1);
      }
    }
    this.authData.remove_follow(follow)
  }

  add_follow_other(profile){
    this.is_follow = true;
    this.following_length += 1;

    this.globalProvider.my_following.push({
      _id:profile._id,
      nickname:profile.nickname,
      country:profile.country
    })

    var follow = {
      id_following:this.authData.user._id,
      id_followed:profile._id,
      nickname_following:this.authData.user.nickname,
      nickname_followed :profile.nickname,
      country_following :this.authData.user.countryData.country,
      country_followed :profile.country,
    }


    this.authData.add_follow(follow)
  }

  remove_follow_other(profile){
    this.following_length -= 1;
    this.is_follow = false;
    var follow = {
      id_following:this.authData.user._id,
      id_followed:profile._id
    }

    for (let index = 0; index < this.globalProvider.my_following.length; index++) {
      if (this.globalProvider.my_following[index]._id == profile._id) {
        this.globalProvider.my_following.splice(index,1);
      }
    }
 
    this.authData.remove_follow(follow)
  }


}
