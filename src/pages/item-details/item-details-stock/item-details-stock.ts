import { Component, ViewChild, AfterViewInit, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Content, AlertController, ToastController, ModalController, ModalOptions } from 'ionic-angular';

import { Http, Headers } from '@angular/http';
import { StockProvider } from '../../../providers/stock/stock';
import { GlobalProvider } from '../../../providers/global/global';
import * as io from "socket.io-client";
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';
import { Vibration } from '@ionic-native/vibration';
import * as $ from 'jquery'
import { Clipboard } from '@ionic-native/clipboard';

@IonicPage({
  name: "item-details-stock"
})
@Component({
  selector: 'page-item-details-stock',
  templateUrl: 'item-details-stock.html',
})
export class ItemDetailsStockPage {
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

  constructor(
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
    public stockProvider: StockProvider) {

    this.initialize()
  }

  async get_item() {
    let symbol = this.navParams.get("symbol");
    let itemd = await this.stockProvider.get_stock_by_symbol(symbol)
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
    this.newsCall();
    this.Segments = ["CHAT", "OVERVIEW", "CHART", "SOCIAL", "NEWS"];
    this.symbol = this.item.symbol;
    this.exchDisp = 'none';
    this.group = "stock";
    this.height = window.screen.height;
    this.globalProvider.get_comments(this.symbol).then((data) => {
      for (let index = 0; index < data.length; index++) {
        this.comments.unshift(data[index]);
      }
      if (this.navParams.get("primary_key") != undefined) {
        this.globalProvider.loading("load comments");
        this.selectedSegment = "CHAT";
        setTimeout(() => {      
          let y = ((document.getElementById(this.navParams.get("primary_key")).parentNode.parentNode)as HTMLElement) .offsetTop;
          this.content_detail.scrollTo(0, y - 50);
          this.globalProvider.dismiss_loading();
        }, 2000)

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
        data.country = data.country.replace("-", " ");
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

  foo() {
    console.log(this.comments);

    this.scrollTo(571)
  }

  scrollTo(elementId: number) {
    let y = document.getElementById(elementId.toString()).offsetTop;
    this.content_detail.scrollTo(0, y - 50);
  }
newsCall(){
  
  this.http.get("https://api.iextrading.com/1.0/stock/"+ this.item.symbol.toLowerCase() + "/news")
  .toPromise()
  .then((data)=>{
    console.log(data)

  })
 
}
  tweetCall() {
    this.http.get('https://xosignals.herokuapp.com/search/' + this.item.symbol + "/en").toPromise().then((res) => {


      this.tweetsdata = res.json().data.statuses;
      console.log(this.tweetsdata);

      for (let index = 0; index < this.tweetsdata.length; index++) {
        let str = this.tweetsdata[index].created_at.split(" ");
        this.tweetsdata[index].created_at = str[1] + " " + str[2] + " " + " " + str[3].substring(0, 5);
        let index2 = this.tweetsdata[index].text.indexOf("https")
        if (index2 > -1) {
          let x = index2;
          this.tweetsdata[index].text = this.tweetsdata[index].text.substring(0, x);
        }
      }
    }).catch((err) => {
      console.log("avi", err);

    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
  }

  changeSegment(segment) {
    this.onTabChanged(segment);
  }


  onTabChanged(segment) {
    if (this.selectedSegment == segment) return;
    switch (segment) {
      case "CHAT":
        console.log("CHAT");
        this.content_detail.scrollToBottom(1000);
        this.selectedSegment = "CHAT";
        break;
      case "OVERVIEW":
        console.log("OVERVIEW");
        this.selectedSegment = "OVERVIEW";
        break;
      case "CHART":
        console.log("CHART");
        this.selectedSegment = "CHART";
        break;
      case "SOCIAL":
        console.log("SOCIAL");
        this.selectedSegment = "SOCIAL";
        break;
      case "NEWS":
        console.log("NEWS");
        this.selectedSegment = "NEWS";
        break;
      default:
        break;
    }
  }


  openUrl(i) {
    window.open("https://twitter.com/i/web/status/" + this.tweetsdata[i].id_str);

  }

  getImgStock() {
    return this.item["logo"];
  }

  errorHandler(event) {
    console.debug(event);
    event.target.src = "assets/imgs/flags/flag general.png";
  }


  makeRandomDataProvider() {
    const dataProvider = [];

    // Generate random data
    for (let year = 1950; year <= 2005; ++year) {
      dataProvider.push({
        year: '' + year,
        value: Math.floor(Math.random() * 100) - 50
      });
    }

    return dataProvider;
  }


  change_sentiment(type) {
    if (!this.globalProvider.isAuth()) {
      this.globalProvider.open_login_alert();
      return;
    }
    if (this.navParams.get("i") == undefined) {
      if (this.item.status == "CLOSE" || this.item.sentiment == 'none') {
        this.item.sentiment = type;
        this.item.status = "OPEN";
        for (let index = 0; index < this.stockProvider.allStocks.length; index++) {
          for (let j = 0; j < this.stockProvider.allStocks[index].data.length; j++) {
            if (this.stockProvider.allStocks[index].data[j].symbol == this.item.symbol) {
              this.stockProvider.allStocks[index].data[j]["sentiment"] = type;
              this.stockProvider.allStocks[index].data[j]["status"] = "OPEN";
            }
          }
        }
        this.globalProvider.add_sentiment(this.item.symbol, type, this.item.type, this.item.price)
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
    var buttons = [{
      text: 'Share',
      handler: () => {
       this.openShareModal(comment);
      }
    }, {
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
    console.log(comment);
    comment["_id"] = comment.user_id
    if (comment.user_id == this.authData.user._id) {
      this.navCtrl.push('my-profile')
    } else {
      this.navCtrl.push('profile', { user: comment })
    }
  }


}
