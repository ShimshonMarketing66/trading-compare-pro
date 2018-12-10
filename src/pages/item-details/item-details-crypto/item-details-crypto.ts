import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

import { Http } from '@angular/http';
import { CryptoProvider } from '../../../providers/crypto/crypto';
import { GlobalProvider } from '../../../providers/global/global';
import { TrackProvider } from '../../../providers/track/track';

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
  constructor( public track:TrackProvider,    public globalProvider:GlobalProvider,
    public http: Http, public navCtrl: NavController, public navParams: NavParams, public cryptoProvider: CryptoProvider) {
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


  openUrl(i) {
    window.open("https://twitter.com/i/web/status/" + this.tweetsdata[i].id_str);
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

    
    change_sentiment(type){
      if (this.navParams.get("i") == undefined) {
        if (this.item.status == "CLOSE"||this.item.sentiment == 'none') {
          this.item.sentiment = type;
          this.item.status = "OPEN";
          this.globalProvider.add_sentiment( this.item.symbol,type,this.item.type,this.item.price)
          .then(()=>{
    
          })
          .catch((err)=>{
            console.error(err);
          })
        }
      }else{
        this.navParams.get("change_sentiment")(type,this.navParams.get("i"),undefined,this.navParams.get('that'))
      }
    }

      


  

  
}
