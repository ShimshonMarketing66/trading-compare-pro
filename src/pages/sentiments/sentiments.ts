import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { StockProvider } from '../../providers/stock/stock';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { ForexProvider } from '../../providers/forex/forex';

@IonicPage({
  name: "sentiments"
})
@Component({
  selector: 'page-sentiments',
  templateUrl: 'sentiments.html',
})
export class SentimentsPage {

  private readonly STOCK: string = "STOCK";
  private readonly FOREX: string = "FOREX";
  private readonly CRYPTO: string = "CRYPTO";
  closed_sentiments: any[] = [];
  opened_sentiments: any[] = [];
  total_profit: number = 0;
  constructor(
    public forexProvider: ForexProvider,
    public cryptoProvider: CryptoProvider,
    public stockProvider: StockProvider,
    public globalProvider: GlobalProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
  
      let sentiments_from_server = new Array();

  this.globalProvider.get_sentiments().then((promsData)=>{
    for (let index = 0; index < promsData.length; index++) {
       sentiments_from_server.push({     
      })
      for (const key in promsData[index]) {
        sentiments_from_server[index][key] =  promsData[index][key];
      }
      
    }
    let promises = [];
    for (let index = 0; index < sentiments_from_server.length; index++) {

      switch (sentiments_from_server[index].symbol_type) {
        case this.STOCK:
          promises.push(this.stockProvider.get_stock_by_symbol(sentiments_from_server[index].symbol))
          break;
        case this.FOREX:
          promises.push(this.forexProvider.get_by_symbol(sentiments_from_server[index].symbol));
          break;
        case this.CRYPTO:
          promises.push(this.cryptoProvider.get_by_symbol(sentiments_from_server[index].symbol));
          break;
        default:
          break;
      }

    }
    
  Promise.all(promises).then((data2) => {
    let num_gain = 0;
    let no_pain_no_gain = 0;
    for (let index = 0; index < data2.length; index++) {
      let open_price_sentiment = sentiments_from_server[index]["price"];
      let type_sentiment = sentiments_from_server[index]["type"];
      for (var k in data2[index]) {
        sentiments_from_server[index][k] = data2[index][k];
      }
      sentiments_from_server[index]["type_sentiment"] = type_sentiment;
      sentiments_from_server[index]["open_price_sentiment"] = open_price_sentiment;

      if (sentiments_from_server[index].status == "OPEN") {
        if (type_sentiment == "BULLISH") {
          sentiments_from_server[index]["change_sentiment"] = this.get_percent(open_price_sentiment, sentiments_from_server[index]["price"]);
        } else {
          sentiments_from_server[index]["change_sentiment"] = this.get_percent(sentiments_from_server[index]["price"], open_price_sentiment);
        }
        this.opened_sentiments.push(sentiments_from_server[index]);
      } else if (sentiments_from_server[index].status == "CLOSE") {
        if (type_sentiment == "BULLISH") {
          sentiments_from_server[index]["change_sentiment"] = this.get_percent(open_price_sentiment, sentiments_from_server[index]["close_price"]);
        } else {
          sentiments_from_server[index]["change_sentiment"] = this.get_percent(sentiments_from_server[index]["close_price"], open_price_sentiment);
        }
        this.closed_sentiments.push(sentiments_from_server[index])
      }
     if (sentiments_from_server[index]["change_sentiment"]>0) {
      num_gain++
     }
     if (sentiments_from_server[index]["change_sentiment"]!=0) {
      no_pain_no_gain++
     }
    
    }
    this.total_profit =(num_gain/no_pain_no_gain)*100;
  })

  })

       
   
        // for (let jj = 0; jj < array.length; jj++) {
        //   const element = array[index];
          
        // }
     
    
  



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SentimentsPage');
  }

  close(item, i) {
    item["status"] = "CLOSE";
    var d = new Date();
    item["close_date"] = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    item["close_price"] = item["price"];
    this.closed_sentiments.push(item);
    this.opened_sentiments.splice(i, 1);
    this.globalProvider.close_sentiment(item.symbol, item.type, item.price);
  }

  get_percent(open_num, curr_num): Number {
    open_num = Number(open_num);
    curr_num = Number(curr_num);
    let a = ((curr_num - open_num) / open_num) * 100;
    return a;
  }

}
