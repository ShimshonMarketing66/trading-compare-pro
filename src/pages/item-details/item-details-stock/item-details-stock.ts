import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

import { Http, Headers } from '@angular/http';
import { StockProvider } from '../../../providers/stock/stock';

@IonicPage({
  name: "item-details-stock"
})
@Component({
  selector: 'page-item-details-stock',
  templateUrl: 'item-details-stock.html',
})
export class ItemDetailsStockPage {
  public options: any;
  private timer: number;
  item: any;
  selectedSegment: string = "CHAT";
  Segments: string[];
  tweetsdata;
  symbol:string;
  exchDisp:string;
  group:string;
  constructor(
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public stockProvider: StockProvider) {
    this.item = navParams.get("item");
    this.tweetCall();
    this.Segments = ["CHAT", "OVERVIEW", "CHART", "SOCIAL", "NEWS"];
    this.symbol = this.item.symbol;
    this.exchDisp = 'none';
    this.group = "stock"
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
    this.onTabChanged(segment)
  }

   
  onTabChanged(segment) {
    if (this.selectedSegment == segment) return;
    switch (segment) {
      case "CHAT":
        console.log("CHAT");
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


  change_sentiment(type){
    this.navParams.get("change_sentiment")(type,this.navParams.get("i"),undefined,this.navParams.get('that'))
  }


}
