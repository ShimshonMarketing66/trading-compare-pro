import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../models/profile-model';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  posts :any[] = [];
  watchlists :any[] = [];

  user_profile : any = {};
  selected_segment = "POSTS";
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public authData:AuthDataProvider) {
    this.user_profile["user_id"] = authData.user._id;
    if (this.user_profile["user_id"] == authData.user._id) {
      this.user_profile = authData.user;
    }else{
      this.authData.getProfileFromServer(this.user_profile["user_id"]).then((user)=>{
        this.user_profile = user;
      })
    }
    console.log(this.user_profile);
    
  }

  ionViewDidLoad() {
    
  }

  change_segment(segment){
    this.selected_segment = segment;
  }

}
