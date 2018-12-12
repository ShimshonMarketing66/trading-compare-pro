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
    total_corect_percent:number,
    _id:string,
    country:string,
    nickname:string
   }[] = [];
  all_users :{
    total_corect_percent:number,
    _id:string,
    country:string,
    nickname:string
   }[] = [];
  selectedSegmentSocialFeeds: string = "Following";
  AllLeaderboard: boolean = false;
  constructor( 
    public track:TrackProvider,
    public authData : AuthDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public globalProvider:GlobalProvider) {
    this.getUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  openComments() {
    alert("Open Comments");
  }

  getUsers() {
   this.globalProvider.get_sentiments_users().then((data:{
    total_corect_percent:number,
    _id:string,
    country:string,
    nickname:string
   }[])=>{
    this.all_users = data;    
    for (let index = 0; index < 10 && index < this.all_users.length; index++) {
      this.all_users[index].total_corect_percent = Number(this.all_users[index].total_corect_percent.toFixed(1))
      this.users.push(this.all_users[index]);
    }
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
   this.navCtrl.push("leaderboard",{
      all_user:this.all_users
   });
  }

  go_to_user_page(user){
    if (user._id == this.authData.user._id) {
      this.navCtrl.push('my-profile')
    }else{
      this.navCtrl.push('profile',{user:user})
    }
  }

}
