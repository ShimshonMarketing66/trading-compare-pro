import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  users: any[] = [];
  all_users :any[] = [];
  selectedSegmentSocialFeeds: string = "Following";
  AllLeaderboard: boolean = false;
  constructor(
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
   this.globalProvider.get_sentiments_users().then((data)=>{
    this.all_users = data;
    for (let index = 0; index < 10 && index < this.all_users.length; index++) {
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
    if (this.AllLeaderboard) return;
    this.AllLeaderboard = true;
  }

}
