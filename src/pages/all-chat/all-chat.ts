import { Component, ViewChild, NgZone, AfterContentInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { AdMobPro } from '@ionic-native/admob-pro';
import * as io from "socket.io-client";
declare var require: any;

@IonicPage({
  name:"all-chat"
})
@Component({
  selector: 'page-all-chat',
  templateUrl: 'all-chat.html',
})
export class AllChatPage implements AfterContentInit {
 
  is_typing: string = "nobodyyy";
  @ViewChild("content_chat") content_chat: Content;
  @ViewChild("myInput") myInput;
  socket: SocketIOClient.Socket;
  comments:any[]=[];
  message: string="";
  moment: any;
  showScrollButton: boolean;
  constructor(public zone:NgZone,public admob:AdMobPro,public navCtrl: NavController, public navParams: NavParams,public globalProvider:GlobalProvider,public authData:AuthDataProvider) {
   
  }

  ngAfterContentInit() {
    this.globalProvider.loading("load comments");
    this.globalProvider.get_comments("all").then((data) => {
      for (let index = 0; index < data.length; index++) {
        this.comments.push(data[index]);
      }
    
      if (this.navParams.get("primary_key") != undefined) {
        setTimeout(() => {
          console.log(this.navParams.get("primary_key"));
          
          let y = ((document.getElementById(this.navParams.get("primary_key")).parentNode)as HTMLElement).offsetTop;
          this.content_chat.scrollTo(0, y - 50);
          this.globalProvider.dismiss_loading();
        }, 2000)

      }else{
        setTimeout(() => {
          this.content_chat.scrollToBottom(0);
          this.globalProvider.dismiss_loading();

        }, 2000)
      }
    })
      .catch((err) => {
        console.log("catch", err);
        this.comments = [];
      })

      this.socket = io.connect("https://xosignals.herokuapp.com/", { path: "/socket/trading-compare-v2/chat" });

      this.socket.emit("chat_room", {
        nickname: this.authData.user.nickname,
        room: "all"
      });
      this.socket.on("on_typing", (data) => {
        if (this.socket.id != data.id) {
          if (this.is_typing == "nobodyyy") {
            this.is_typing = data.nickname;
            setTimeout(() => {
              this.is_typing = "nobodyyy";
            }, 3000)
          }
        }
      });
  
  
  
      this.socket.on("on_message", (data) => {
        if (this.socket.id != data.id) {
          data.country = data.country.replace(" ","-");
          this.comments.push(data);
        }
      });
  
  
      this.socket.on("on_primary_key", (data) => {      
        for (let index = this.comments.length - 1; index > -1; index--) {
          if (data.user_id == this.comments[index].user_id) {
            this.comments[index]["primary_key"] = data.primary_key;
          }
        }
      });
  
  }

  scroll_up() {
    this.content_chat.scrollToBottom(1000);
  }

  reply(comment) {
    this.message = "@" + comment.nickname + " ";
    this.content_chat.scrollToBottom(500);
    this.myInput.setFocus();
  }



  typing() {
    console.log("typing");
    this.socket.emit("typing", "all");
  }
  
  ionViewDidEnter() {
    this.content_chat.ionScrollEnd.subscribe((data)=>{
      let dimensions = this.content_chat.getContentDimensions();
      let scrollTop = this.content_chat.scrollTop;
      let contentHeight = dimensions.contentHeight;
      let scrollHeight = dimensions.scrollHeight;
      this.zone.run(()=>{
        if ( (scrollTop + contentHeight + 20) > scrollHeight) {
          this.showScrollButton = false;
        } else {
          this.showScrollButton = true;
        } 
      })
      

    });
  }

  sendMessage() {
    
    if (!this.globalProvider.isAuth()) {
      this.globalProvider.open_login_alert();
      return;
    }

    if (this.message === '') {
      return;
    }
    
    var data = {
      nickname: this.authData.user.nickname,
      txt: this.message,
      symbol: "all",
      user_id: this.authData.user._id,
      country: this.authData.user.countryData.country.toLowerCase(),
    }
    this.socket.emit("message", data);
    let moment = require('moment');
    data["date"] = new Date();
    let aa = (data["date"]).getTime();
    data["date_from_now"] = moment(aa).fromNow();
     
    
    this.comments.push(data);
    this.content_chat.scrollToBottom(1000);
    this.message = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllChatPage');
  }
  consultar(){
    this.admob.showBanner(this.admob.AD_POSITION.BOTTOM_CENTER);
  }

  foodd(){
    this.admob.hideBanner();
  }

  scrollTo(elementId: number) {
    let y = document.getElementById(elementId.toString()).offsetTop;
    this.content_chat.scrollTo(0, y - 50);
  }

  go_to_profile(comment){
    console.log(comment);
    comment["_id"] = comment.user_id
    if (comment.user_id == this.authData.user._id) {
      this.navCtrl.push('my-profile')
    } else {
      this.navCtrl.push('profile', { user: comment })
    }
  }


}
