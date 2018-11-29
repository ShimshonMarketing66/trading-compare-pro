import { Component, trigger, transition, animate, keyframes, style } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { GlobalProvider } from '../../providers/global/global';


@IonicPage()
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
  posts :any[] = [];

  user_profile : any = {};
  selected_segment = "POSTS";
  constructor(
    public globalProvider:GlobalProvider,
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
  foo(){
    console.log(this.globalProvider.watchlists);
    
  }

  change_segment(segment){
    this.selected_segment = segment;
  }

}
