import { Component, ViewChild, AfterViewInit, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Content } from 'ionic-angular';

import { Http, Headers } from '@angular/http';
import { StockProvider } from '../../../providers/stock/stock';
import { GlobalProvider } from '../../../providers/global/global';
import * as io from "socket.io-client";
import { AuthDataProvider } from '../../../providers/auth-data/auth-data';

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
  selectedSegment: string = "CHART";
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
    public zone: NgZone,
    public authData: AuthDataProvider,
    public globalProvider: GlobalProvider,
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public stockProvider: StockProvider) {
    this.item = navParams.get("item");
    this.tweetCall();
    this.Segments = ["CHAT", "OVERVIEW", "CHART", "SOCIAL", "NEWS"];
    this.symbol = this.item.symbol;
    this.exchDisp = 'none';
    this.group = "stock";
    this.height = window.screen.height;
    this.globalProvider.get_comments(this.symbol).then((data) => {
      console.log(data);

      for (let index = 0; index < data.length; index++) {
        data[index].country = data[index].country.replace("-", " ");
        this.comments.unshift(data[index]);
      }
    })
      .catch((err) => {
        console.log("catch");
        
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


  }

  foo() {
    console.log(this.comments);

  }
  tweetCall() {
    this.http.get('https://xosignals.herokuapp.com/search/' + this.item.symbol + "/en").toPromise().then((res) => {
      console.log(res);

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


  remove_from_watchlist() {
    this.item.is_in_watchlist = false;
    this.navParams.get("remove_from_watchlist")(undefined, this.item.symbol, this.item.type, this.navParams.get("i"), this.navParams.get('that'), this.item)
  }

  add_to_watchlist() {
    this.item.is_in_watchlist = true;
    this.navParams.get("add_to_watchlist")(undefined, this.item.symbol, this.item.type, this.navParams.get("i"), this.navParams.get('that'), this.item)
  }

  typing() {
    console.log("typing");
    this.socket.emit("typing", this.symbol);
  }

  released() {
    alert("pressed")
    console.log("released");
  }

  sendMessage() {
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


}
