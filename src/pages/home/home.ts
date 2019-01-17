import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { TrackProvider } from '../../providers/track/track';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  users: {
    total_corect_percent: number,
    _id: string,
    country: string,
    nickname: string
  }[] = [];
  all_users: {
    total_corect_percent: number,
    _id: string,
    country: string,
    nickname: string
  }[] = [];
  selectedSegmentSocialFeeds: string = "Newest";
  AllLeaderboard: boolean = false;
  newest_activities: any[] = [];
  newest_following_activities: any[]=[];
  constructor(
    public track: TrackProvider,
    public authData: AuthDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public globalProvider: GlobalProvider) {
    track.log_screen("home");
    this.getUsers();
    this.get_last_activity()
    this.globalProvider.get_last_activity_of_following().then((data)=>{
      console.log("get_last_activity_of_following",data);
      this.finish_refresh();
      this.newest_following_activities = data;
      
    })

    this.globalProvider.get_last_activity().then((data:any[])=>{
      this.newest_activities = data;
      this.finish_refresh();
    })

   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  openComments() {
    alert("Open Comments");
  }

  getUsers() {
    this.globalProvider.get_sentiments_users().then((data: {
      total_corect_percent: number,
      _id: string,
      country: string,
      nickname: string
    }[]) => {
      console.log(data);
      
      this.all_users = data;
      for (let index = 0; index < 10 && index < this.all_users.length; index++) {
        this.all_users[index].total_corect_percent = Number(this.all_users[index].total_corect_percent.toFixed(1))
        this.users.push(this.all_users[index]);
      }
    })
  }
  get_last_activity() {
    console.log("get_last_activity");
    
    this.globalProvider.get_last_activity().then((data)=>{
      console.log("get_last_activity 2 ");

      console.log(data);
      
    })
  }
in_refreshing = false;
  refresh(){
    if (this.in_refreshing) {
      return;
    }
    this.in_refreshing = true;
    this.counter_refresher = 0;

    this.globalProvider.get_last_activity().then((data:any[])=>{
      this.newest_activities = data;
      this.finish_refresh();
    })
    this.globalProvider.get_last_activity_of_following().then((data)=>{
      console.log("get_last_activity_of_following",data);
      this.finish_refresh();
      this.newest_following_activities = data;
      
    })
  }
counter_refresher = 0;
  finish_refresh(){
    this.counter_refresher++;
if (this.counter_refresher == 2) {
  this.in_refreshing = false;
}
  }



  changeSocialFeedSegment(segment) {
    if (this.selectedSegmentSocialFeeds == segment) return;
    switch (segment) {
      case "Following":
        console.log("Following");
        this.selectedSegmentSocialFeeds = "Following";
        break;
      case "Newest":
        console.log("Newest");
        this.selectedSegmentSocialFeeds = "Newest";
        break;
      case "Popular":
        console.log("Popular");
        this.selectedSegmentSocialFeeds = "Popular";
        break;

      default:
        break;
    }
  }

  seeAllLeaderboard() {
    this.navCtrl.push("leaderboard", {
      all_user: this.all_users
    });
  }

  go_to_comment_v2(user, ev){
    if (ev != undefined) {
      ev.stopPropagation();
    }

    if (user._id == undefined && user.user_id != undefined) {
      user["_id"] = user.user_id;
    }
    if (user.symbol == "all") {
      this.navCtrl.push("all-chat", {
        primary_key:user.primary_key
      })
    } else {
      var page = "item-details-"
      console.log("da",user.symbol);
      var obj={
        primary_key:user.primary_key,
        symbol:user.symbol
      }
      switch (this.globalProvider.get_symbol_type(user.symbol)) {
        case "FOREX":
          page += "forex";
          break;
        case "CRYPTO":
          page += "crypto";
          break;
        case "STOCK":
          page += "stock";
          break;

        default:
          break;
      }
  
      this.navCtrl.push(page, {
        symbol:obj.symbol,
        primary_key:obj.primary_key
      })
    
  }
}


  go_to_user_page(user, ev) {
    if (ev != undefined) {
      ev.stopPropagation();
    }
    console.log(user);
    
    if (user._id == this.authData.user._id) {
      this.navCtrl.push('my-profile')
    } else {
      if (user._id == undefined && user.user_id != undefined) {
        user["_id"] = user.user_id;
      }
      this.navCtrl.push('profile', { user: user })
    }
  }

  go_to_user_profile(user, ev?) {
    if (ev != undefined) {
      ev.stopPropagation();
    }
    console.log(user);
    
    if (user._id == this.authData.user._id || user.user_following == this.authData.user._id|| user.user_id == this.authData.user._id) {
      this.navCtrl.push('my-profile')
    } else {
      switch (user.m_type) {
        case "comment":
        user["_id"] = user.user_id;
          break;

          case "sentiment":
          user["_id"] = user.user_id;
          break;

          case "followers":
          user["_id"] = user.user_following;
          break;
      
        default:
          break;
      }
     
      this.navCtrl.push('profile', { user: user })
    }
  }


  go_to_comment(user, ev) {
    if (ev != undefined) {
      ev.stopPropagation();
    }
    if (user._id == undefined && user.user_id != undefined) {
      user["_id"] = user.user_id;
    }
    if (user.symbol == "all") {
      this.navCtrl.push("all-chat", {
        primary_key:user.primary_key
      })
    } else {
      var page = "item-details-"
      console.log("da",user.symbol);
      var obj={
        primary_key:user.primary_key,
        symbol:user.symbol
      }
      switch (this.globalProvider.get_symbol_type(user.symbol)) {
        case "FOREX":
          page += "forex";
          break;
        case "CRYPTO":
          page += "crypto";
          break;
        case "STOCK":
          page += "stock";
          break;

        default:
          break;
      }
  

      this.navCtrl.push(page, {
        symbol:obj.symbol,
        primary_key:obj.primary_key
      })
    }

  }

}
