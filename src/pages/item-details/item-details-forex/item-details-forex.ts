import { Component, ViewChild, NgZone, HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController, ToastController, ModalController, Platform } from 'ionic-angular';

import { Http } from '@angular/http';
import { GlobalProvider } from '../../../providers/global/global';
import * as io from "socket.io-client";
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';
import { Vibration } from '@ionic-native/vibration';
import * as $ from 'jquery'
import { Clipboard } from '@ionic-native/clipboard';
import { TrackProvider } from '../../../providers/track/track';
import { ForexProvider } from '../../../providers/forex/forex';
import { AdmobProvider } from '../../../providers/admob/admob';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ChartUI } from '../../../components/chartIQ/ui_component/ui.component';


@IonicPage({
  name: "item-details-forex"
})

@HostListener('focus', ['$event.target.value'])

@Component({
  selector: 'page-item-details-forex',
  templateUrl: 'item-details-forex.html',
})
export class ItemDetailsForexPage {
  @ViewChild("content_detail") content_detail: Content;
  @ViewChild("myInput") myInput;
  @ViewChild("chart_ui") chart_ui: ChartUI;
  height_screen = window.screen.height;
  orientation_mode = "portrait";


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
  header_forex: boolean = true;
sentiment:any;
  news: any=[];
  symbol_chart: string;


  constructor( 
    public platform: Platform,
    private screenOrientation: ScreenOrientation,
    public track:TrackProvider,
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
    public forexProvider: ForexProvider) {
      let symbol
      if (this.navParams.get("symbol") != undefined) {
        this.symbol_chart = this.navParams.get("symbol").slice(0,3)+'/'+this.navParams.get("symbol").slice(3,6)
        symbol=this.navParams.get("symbol");
      }else{
        this.symbol_chart = this.navParams.get("item").symbol.slice(0,3)+'/'+this.navParams.get("item").symbol.slice(3,6)
        symbol=this.navParams.get("item").symbol;
      }
      
     this.globalProvider.get_sentiment_by_symbol(symbol).then((data)=>{
      this.sentiment=data;
     })
   
     track.log_screen("item-details-forex-" + symbol);
     
 
    this.admob.showBanner();

  
     
  
    this.initialize()
  }

  async get_item() {
    let symbol = this.navParams.get("symbol");
    let itemd = await this.forexProvider.get_by_symbol(symbol)
    console.log(itemd);
    this.item = itemd;


  }

  // newsCall(){
  
  //   this.http.get("https://api.iextrading.com/1.0/stock/"+ this.item.symbol.toLowerCase() + "/news")
  //   .toPromise()
  //   .then((data:any)=>{
  //     console.log(JSON.parse(data._body));
  //     this.news=JSON.parse(data._body);
  
  //   })
   
  // }

  
  async initialize() {
    this.item = this.navParams.get("item");
    if (this.item == undefined) {
      await this.get_item();
    } else {
      this.selectedSegment = "CHART";
    }

    this.tweetCall();
    // this.newsCall();
    this.Segments = ["CHAT", "OVERVIEW", "CHART", "SOCIAL"];
    this.symbol = this.item.symbol;
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
    this.socket = io.connect("http://localhost:5000/", { path: "/socket/trading-compare-v2/chat" });

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

  consultar(){
    document.getElementById("header_forex").style.display = "unset"
    this.header_forex = true;
    this.admob.showBanner();
  }

  foodd(){
    document.getElementById("header_forex").style.display = "none"
    this.header_forex = false;
    this.admob.hideBanner();
  }

  tweetCall() {
    this.http.get('https://xosignals.herokuapp.com/search/' + this.item.symbol + "/en").toPromise().then((res) => {
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

  changeSegment(segment) {
    this.onTabChanged(segment)
  }

  onTabChanged(segment) {
    if (this.selectedSegment == segment) return;
    switch (segment) {
      case "CHAT":
        this.selectedSegment = "CHAT";
        if (this.platform.is("cordova")) {
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
        }
        break;
      case "OVERVIEW":
        this.selectedSegment = "OVERVIEW";
        if (this.platform.is("cordova")) {
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
        }
        break;
      case "CHART":
        this.selectedSegment = "CHART";
        if (this.platform.is("cordova")) {
          this.screenOrientation.unlock()
        }
        break;
      case "SOCIAL":
        this.selectedSegment = "SOCIAL";
        if (this.platform.is("cordova")) {
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
        }
        break;
      case "NEWS":
        this.selectedSegment = "NEWS";
        if (this.platform.is("cordova")) {
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
        }
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
        for (let index = 0; index < this.forexProvider.allForex.length; index++) {
            if (this.forexProvider.allForex[index].symbol == this.item.symbol) {
              this.forexProvider.allForex[index]["sentiment"] = type;
              this.forexProvider.allForex[index]["status"] = "OPEN";
            }
          }
        
        let toast = this.toastCtrl.create({
          message:this.item.symbol + " has been added to your sentiments.",
          duration:2000
        })
        toast.present();
        this.globalProvider.add_sentiment(this.item.symbol, type, this.item.type, this.item.price,"item-details-forex")
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
                message: 'Message Deleted!',
                duration: 1500,
                position: 'bottom'
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
      screen:"item-details-forex-" + this.item.symbol
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

  async ionViewWillLeave() {
    this.admob.hideBanner();
    this.socket.disconnect();
    if (this.platform.is("cordova")) {
      await this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
    }
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

    this.screenOrientation.onChange().subscribe((data) => {
      console.log("Orientation Changed", this.screenOrientation.type);
      this.zone.run(()=>{

      if (this.screenOrientation.type.indexOf("portrait") > -1) {
        this.orientation_mode = "portrait";
        this.chart_ui.clearStudies();
        this.chart_ui.changeChartType({
          type: 'mountain',
          label: 'mountain',
        })
        this.height_screen = window.screen.height;
        document.getElementById("ciq-chart-area-for-lanscape-mode").style.height = "70%";
      } else {

        this.height_screen = window.screen.height;
        this.orientation_mode = "landscape";
        if (document.getElementById("ciq-chart-area-for-lanscape-mode").style != undefined) {
          document.getElementById("ciq-chart-area-for-lanscape-mode").style.height = "83%";
        }


        if (document.getElementsByTagName("canvas")[0] != undefined) {
          document.getElementsByTagName("canvas")[0].style.height = "100%"
        }
      }

    });
  });


  }

  scroll_up() {
    this.content_detail.scrollToTop(1000);
  }


  openUrl(i) {
    this.track.log_event("open_tweet",{
      screen:"item-details-forex-" + this.item.symbol,
      new_title:this.tweetsdata[i].id_str
    })
    window.open("https://twitter.com/i/web/status/" + this.tweetsdata[i].id_str);
  }

  open_borker(){
    window.open(this.globalProvider.sponcer.link);
  }

  reply(comment) {
    this.message = "@" + comment.nickname + " ";
    this.myInput.setFocus();
  }

  go_to_profile(comment) {
    this.track.log_event("go_to_profil",{
      screen:"item-details-forex-" + this.item.symbol,
      nickname_to_visit:comment.nickname
    })
    comment["_id"] = comment.user_id
    if (comment.user_id == this.authData.user._id) {
      this.navCtrl.push('my-profile')
    } else {
      this.navCtrl.push('profile', { user: comment })
    }
  }

  translate(comment){
    if (comment.translated_txt_tmp == undefined) {
      this.globalProvider.loading("traslate text...")
      this.globalProvider.translate(comment.txt.replace(/´/g, "'")).then((data)=>{
        comment["translated_txt_tmp"] = data;
        comment["translated_txt"] = data;
        this.globalProvider.dismiss_loading();
      }).catch((err)=>{
       console.log("err",err);
   
      })
    }else{
      comment.translated_txt = comment.translated_txt_tmp
    }
  
    this.track.log_event("translate",{
      screen:"all-chat-page",
      comment_id:comment.primary_key
    })
    
  }
  see_original(comment){
    comment["translated_txt"] = undefined;
  }

  





}
