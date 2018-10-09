import { Component, ViewChild, AfterViewInit } from '@angular/core';
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
export class ItemDetailsStockPage implements AfterViewInit {
  item: any;
  selectedSegment: string = "CHAT";
  slideNow: string;
  slides: { id: string; }[];
  @ViewChild('slideChat') slideChat: any;
  @ViewChild('slideOverview') slideOverview: any;
  @ViewChild('slideChart') slideChart: any;
  @ViewChild('slideSocial') slideSocial: any;
  @ViewChild('slideNews') slideNews: any;
  @ViewChild('mySlider') slider: Slides;
  tweetsdata;
  constructor(public http: Http, public navCtrl: NavController, public navParams: NavParams, public stockProvider: StockProvider) {
    this.item = navParams.get("item");
    this.tweetCall();
    this.slides = [
      {
        id: "CHAT"
      },
      {
        id: "OVERVIEW"
      }, {
        id: "CHART"
      }, {
        id: "SOCIAL"
      }, {
        id: "NEWS"
      }
    ];
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

  ngAfterViewInit(): void {
    this.slideNow = this.slideChat;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
  }

  onSlideChanged(slider) {
    if (slider.getActiveIndex() == 5) return;
    const currentSlide = this.slides[slider.getActiveIndex()];
    if (currentSlide == undefined) return;
    this.selectedSegment = currentSlide.id;
  }


  changeSegment(segment) {
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

    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segment;
    });
    this.slider.slideTo(selectedIndex);
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


}
