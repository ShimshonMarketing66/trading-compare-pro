import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

import { Http } from '@angular/http';
import { CryptoProvider } from '../../../providers/crypto/crypto';

@IonicPage({
  name: "item-details-crypto"
})
@Component({
  selector: 'page-item-details-crypto',
  templateUrl: 'item-details-crypto.html',
})
export class ItemDetailsCryptoPage {
  symbol: string;
  item: any;
  Segments: string[];
  selectedSegment: string = "CHAT";
  tweetsdata;
  constructor(public http: Http, public navCtrl: NavController, public navParams: NavParams, public cryptoProvider: CryptoProvider) {
    this.item = navParams.get("item");    
    this.tweetCall();
    this.Segments = ["CHAT", "OVERVIEW", "CHART", "SOCIAL", "NEWS"];
    this.symbol = this.item.symbol;

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
}
