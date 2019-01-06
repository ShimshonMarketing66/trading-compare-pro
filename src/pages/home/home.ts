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
  newest_comments: any[] = [] = [];
  newest_following_comments: any[]=[];
  constructor(
    public track: TrackProvider,
    public authData: AuthDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public globalProvider: GlobalProvider) {
    track.log_screen("home");
    this.getUsers();
    this.get_newest_comments()
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

  get_newest_comments() {
    if (this.authData.isFinishRegistration) {
  

      this.globalProvider.get_newest_following_comments().then((data: any[]) => {
        this.newest_following_comments = data;
      })
        .catch((err) => {
          console.error(err);
        })
    }

    this.globalProvider.get_newest_comments().then((data: any[]) => {
      this.newest_comments = data;
    })
      .catch((err) => {
        console.error(err);
      })

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

  go_to_user_page(user, ev) {
    if (ev != undefined) {
      ev.stopPropagation();
    }
    if (user._id == this.authData.user._id) {
      this.navCtrl.push('my-profile')
    } else {
      if (user._id == undefined && user.user_id != undefined) {
        user["_id"] = user.user_id;
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
