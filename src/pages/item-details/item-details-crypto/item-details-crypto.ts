import { Component, ViewChild, NgZone, HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController, ToastController, ModalController } from 'ionic-angular';

import { Http } from '@angular/http';
import { GlobalProvider } from '../../../providers/global/global';
import * as io from "socket.io-client";
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';
import { Vibration } from '@ionic-native/vibration';
import * as $ from 'jquery'
import { Clipboard } from '@ionic-native/clipboard';
import { TrackProvider } from '../../../providers/track/track';
import { CryptoProvider } from '../../../providers/crypto/crypto';
import { AdmobProvider } from '../../../providers/admob/admob';


@HostListener('focus', ['$event.target.value'])


@IonicPage({
  name: "item-details-crypto"
})
@Component({
  selector: 'page-item-details-crypto',
  templateUrl: 'item-details-crypto.html',
})
export class ItemDetailsCryptoPage {
  @ViewChild("content_detail") content_detail: Content;
  @ViewChild("myInput") myInput;

  is_on_bottom = true;
  message: string = "";
  item: any;
  selectedSegment: string;
  Segments: string[];
  tweetsdata;
  symbol: string;
  exchDisp: string;
  group: string;
  comments: any[] = [];
  socket: SocketIOClient.Socket;
  is_typing: string = "nobodyyy";
  height: number;
  shouldScrollDown: boolean;
  showScrollButton: boolean;
  header_crypto: boolean = true;
sentiment:any;
  news: any=[];

  constructor( public track:TrackProvider,
    public admob:AdmobProvider,
    public modalCrl:ModalController,
    private toastCtrl: ToastController,
    private clipboard: Clipboard,
    public alertCtrl: AlertController,
    private vibration: Vibration,
    public zone: NgZone,
    public authData: AuthDataProvider,
    public globalProvider: GlobalProvider,
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public cryptoProvider: CryptoProvider) {
      let symbol;
      if (this.navParams.get("symbol") != undefined) {
        symbol = this.navParams.get("symbol");
      }else{
        symbol = this.navParams.get("item").symbol
      }
     this.globalProvider.get_sentiment_by_symbol(symbol).then((data)=>{
      this.sentiment=data;
     })
     track.log_screen("item-details-crypto-" + symbol);

    this.admob.showBanner();
   
  
     
  
    this.initialize()
  }

  consultar(){
    document.getElementById("header_crypto").style.display = "unset"
    this.header_crypto = true;
    this.admob.showBanner();
  }

  foodd(){
    document.getElementById("header_crypto").style.display = "none"
    this.header_crypto = false;
    this.admob.hideBanner();
  }

  async get_item() {
    let symbol = this.navParams.get("symbol");
    let itemd = await this.cryptoProvider.get_by_symbol(symbol)
    console.log(itemd);
    this.item = itemd;


  }


  async initialize() {
    this.item = this.navParams.get("item");
    if (this.item == undefined) {
      await this.get_item();
    } else {
      this.selectedSegment = "CHART";
    }

    this.tweetCall();
    this.Segments = ["CHAT", "OVERVIEW", "CHART", "SOCIAL"];
    this.symbol = this.item.symbol;
    this.exchDisp = 'none';
    this.group = "crypto";
    this.height = window.screen.height;
    this.globalProvider.get_comments(this.symbol).then((data) => {
      for (let index = 0; index < data.length; index++) {
        this.comments.unshift(data[index]);
      }
      if (this.navParams.get("primary_key") != undefined) {
        this.globalProvider.loading("load comments");
        this.selectedSegment = "CHAT";
        setTimeout(() => {
          let y = ((document.getElementById(this.navParams.get("primary_key")).parentNode.parentNode)as HTMLElement).offsetTop;
          this.content_detail.scrollTo(0, y - 50);
          this.globalProvider.dismiss_loading();
        }, 2000)

      }else{
        this.selectedSegment = "CHART";
      }
    })
      .catch((err) => {
        console.log("catch", err);
        this.comments = [];
      })
    // http://localhost:5000/
    // https://xosignals.herokuapp.com/
    this.socket = io.connect("https://xosignals.herokuapp.com/", { path: "/socket/trading-compare-v2/chat" });

    this.socket.emit("chat_room", {
      nickname: this.authData.user.nickname,
      room: this.symbol
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
        this.comments.unshift(data);
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



  tweetCall() {
    this.http.get('https://xosignals.herokuapp.com/search/' + this.item.name + "/en").toPromise().then((res) => {
      this.tweetsdata = res.json().data.statuses;
      for (let index = 0; index < this.tweetsdata.length; index++) {
        let str = this.tweetsdata[index].created_at.split(" ");
        this.tweetsdata[index].created_at = str[1] + " " + str[2] + " " + " " + str[3].substring(0, 5);
        let index2 = this.tweetsdata[index].text.indexOf("https")
        if (index2 > -1) {
          let x = index2;
          this.tweetsdata[index].text = this.tweetsdata[index].text.substring(0, x);
        }
      }
    }).catch((err)=>{
      console.log("avi",err);
      
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
  }


  openUrl(i) {
    this.track.log_event("open_tweet",{
      screen:"item-details-crypto-" + this.item.symbol,
      new_title:this.tweetsdata[i].id_str
    })
    window.open("https://twitter.com/i/web/status/" + this.tweetsdata[i].id_str);
  }

  changeSegment(segment) {
    this.onTabChanged(segment)
    }
    onTabChanged(segment) {
      if (this.selectedSegment == segment) return;
      switch (segment) {
        case "CHAT":
          this.selectedSegment = "CHAT";
          break;
        case "OVERVIEW":
          this.selectedSegment = "OVERVIEW";
          break;
        case "CHART":
          this.selectedSegment = "CHART";
          break;
        case "SOCIAL":
          this.selectedSegment = "SOCIAL";
          break;
        case "NEWS":
          this.selectedSegment = "NEWS";
          break;
        default:
          break;
      }
    }

    
    change_sentiment(type) {
    
      if (!this.globalProvider.isAuth()) {
        this.globalProvider.open_login_alert();
        return;
      }
      if (this.item.status == "OPEN") {
        return;
      }
      if (type == "BULLISH") {
        this.sentiment[0].count++;
      }else{
        this.sentiment[1].count++;
      }
      if (this.navParams.get("i") == undefined) {
        if (this.item.status == "CLOSE" || this.item.sentiment == 'none') {
          this.item.sentiment = type;
          this.item.status = "OPEN";
          for (let index = 0; index < this.cryptoProvider.arrAllCrypto.length; index++) {
              if (this.cryptoProvider.arrAllCrypto[index].symbol == this.item.symbol) {
                this.cryptoProvider.arrAllCrypto[index]["sentiment"] = type;
                this.cryptoProvider.arrAllCrypto[index]["status"] = "OPEN";
              }
          }
          let toast = this.toastCtrl.create({
            message:this.item.name + " has been added to your sentiments.",
            duration:2000
          })
          toast.present();
          this.globalProvider.add_sentiment(this.item.symbol, type, this.item.type, this.item.price,"item-details-crypto")
            .then(() => {
  
            })
            .catch((err) => {
              console.error(err);
            })
        }
      } else {
        this.navParams.get("change_sentiment")(type, this.navParams.get("i"), undefined, this.navParams.get('that'))
      }
    }

    typing() {
      console.log("typing");
      this.socket.emit("typing", this.symbol);
    }

    timeout_press: any;
  released(comment_id, comment) {

    clearTimeout(this.timeout_press);

    this.timeout_press = setTimeout(() => {
      console.log($("#" + comment_id).is(':active'));
      if ($("#" + comment_id).is(':active')) {
        this.vibration.vibrate(200);
        this.open_alert(comment);
      }
    }, 500)
  }

  open_alert(comment) {
    var buttons = [
    //   {
    //   text: 'Share',
    //   handler: () => {
    //    this.openShareModal(comment);
    //   }
    // }
    // ,
    {
      text: 'Copy',
      handler: () => {
        this.clipboard.copy(comment.txt).then(() => {
          let toast = this.toastCtrl.create({
            message: 'Message Copied!',
            duration: 1500,
            position: 'bottom'
          });
          toast.present();
        })

      }
    }];
    if (comment.user_id == this.authData.user._id && comment.primary_key != undefined && comment.primary_key != null && comment.primary_key !== "") {
      buttons.push({
        text: 'Delete',
        handler: () => {
          for (let index = 0; index < this.comments.length; index++) {
            if (this.comments[index].primary_key == comment.primary_key) {
              this.comments.splice(index, 1);
              let toast = this.toastCtrl.create({
                message: 'Message Copied!',
                duration: 1500,
                position: 'middle'
              });
              toast.present();
            }
          }
          this.authData.deleteComment(comment);
        }
      })
    }

    let alert = this.alertCtrl.create({
      title: "Message Options",
      buttons: buttons
    });
    alert.present();
  }
  
  open_borker(){
    window.open(this.globalProvider.sponcer.link);
  }

  openShareModal(comment){
    let modal = this.modalCrl.create("share-comment",{
      comment:comment
    },{
      cssClass:"share-comment",
      enableBackdropDismiss:true,
      showBackdrop:true,
    })
    modal.present()
    modal.onDidDismiss(comment=>{
      console.log(comment);
    })
  }

  sendMessage() {
    
    if (!this.globalProvider.isAuth()) {
      this.globalProvider.open_login_alert();
      return;
    }

    if (this.message === '') {
      return;
    }
    
    this.track.log_event("post_comment",{
      screen:"item-details-crypto-" + this.item.symbol
    })
    
    var data = {
      nickname: this.authData.user.nickname,
      txt: this.message,
      symbol: this.symbol,
      user_id: this.authData.user._id,
      country: this.authData.user.countryData.country.toLowerCase(),
    }
    this.socket.emit("message", data);
    this.comments.unshift(data);
    this.content_detail.scrollToTop(1000);
    this.message = '';
  }
  ionViewDidLeave() {
    this.admob.hideBanner();
    this.socket.disconnect();
  }


  ionViewDidEnter() {
    this.content_detail.ionScrollEnd.subscribe((data) => {
      let scrollTop = this.content_detail.scrollTop;
      this.zone.run(() => {

        if (scrollTop < 300) {
          this.shouldScrollDown = true;
          this.showScrollButton = false;
        } else {
          this.shouldScrollDown = false;
          this.showScrollButton = true;
        }
      })
    });
  }

  scroll_up() {
    this.content_detail.scrollToTop(1000);
  }

  reply(comment) {
    this.message = "@" + comment.nickname + " ";
    this.myInput.setFocus();
  }

  go_to_profile(comment) {
    this.track.log_event("go_to_profil",{
      screen:"item-details-crypto-" + this.item.symbol,
      nickname_to_visit:comment.nickname
    })
    comment["_id"] = comment.user_id
    if (comment.user_id == this.authData.user._id) {
      this.navCtrl.push('my-profile')
    } else {
      this.navCtrl.push('profile', { user: comment })
    }
  }


  
    }

      


  

  

