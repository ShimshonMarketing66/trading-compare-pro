import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  users: any[] = [];
  selectedSegmentSocialFeeds: string = "Following";
  AllLeaderboard: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.getUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  openComments() {
    alert("Open Comments");
  }

  getUsers() {
    this.users = [{
      name: "Jaime Lannister",
      profit: "34%",
      flag: "france"
    }, {
      name: "Jon Snow",
      profit: "32%",
      flag: "france"
    }, {
      name: "White Walker",
      profit: "31%",
      flag: "france"
    }, {
      name: "Doran Martell",
      profit: "29%",
      flag: "france"
    }, {
      name: "Aviho Sasson",
      profit: "28%",
      flag: "france"
    }, {
      name: "Yossef Azoulay",
      profit: "26%",
      flag: "france"
    }, {
      name: "Rina Touati",
      profit: "21%",
      flag: "france"
    }, {
      name: "Tsion",
      profit: "12%",
      flag: "cyprus"
    }, {
      name: "Sangoku",
      profit: "10%",
      flag: "estonia"
    }]
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
