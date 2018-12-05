import { Component, trigger, transition, animate, keyframes, style, ViewChild, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { GlobalProvider } from '../../providers/global/global';


@IonicPage({
  name: "my-profile"
})
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
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
export class MyProfilePage {

  edit_description: boolean = false;
  counter_left_description: number = 0;

  @ViewChild("myDesciption") myDesciption: any;

  profile_country;
  posts_length=0;
  posts: any[] = [];
  is_follow = false;
  selected_segment = "POSTS";
  watchlist_length: number = 0;
  followers_length=0;
  following_length= 0;
  constructor(
    public globalProvider: GlobalProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authData: AuthDataProvider) {

      this.globalProvider.loading("get user profile");
      this.authData.getPost(this.authData.user._id)
      .then((data)=>{
        this.posts = data;
        this.posts_length = this.posts.length;
        this.globalProvider.dismiss_loading();
      })
      this.followers_length = this.globalProvider.my_followers.length;
      this.following_length = this.globalProvider.my_following.length;
      this.watchlist_length = this.globalProvider.watchlists.length;
      

  }

  foo() {
    console.log(this.posts);

  }

  follow() {
    this.is_follow = this.is_follow
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

  description_change() {
    this.counter_left_description = 200 - this.myDesciption.value.length;
  }

  submit_description() {
    this.edit_description = false;
    this.authData.updateFields({
      description: this.authData.user.description
    })
  }

  remove_follow_other(profile){
    var follow = {
      id_following:this.authData.user._id,
      id_followed:profile._id
    }

    let arr ;
    if (this.selected_segment == "FOLLOWERS") {
      arr = this.globalProvider.my_followers;
    }else{
      arr = this.globalProvider.my_following;
    }
    for (let index = 0; index < arr.length; index++) {
      if (arr[index]._id == profile._id) {
        arr.splice(index,1);
      }
    }
 
    this.authData.remove_follow(follow)
  }

  go_to_comment(comment){
    let a = this.globalProvider.get_symbol_type(comment.symbol)
    console.log(a);
    let page: string = ""    
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
     this.navCtrl.pop({animate:true,direction: 'forward'});
     this.navCtrl.push(page, {
       primary_key:comment.primary_key,
       symbol:comment.symbol
     },{animate:false})
    
   }

   
  go_to_profile(user){
    this.navCtrl.pop({animate:false});
    this.navCtrl.push('profile',{user:user})
   }


}
