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

  sentiments :any[] = [];
  constructor(
    public forexProvider:ForexProvider,
    public cryptoProvider:CryptoProvider,
    public stockProvider:StockProvider,
    public globalProvider: GlobalProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.globalProvider.get_sentiments().then((data:{
      type:string,symbol_type:string,price:number,user_id:string,symbol:string
    }[]) => {
      console.log(data);
      
     let promises = [];
     for (let index = 0; index < data.length; index++) {
      switch (data[index].symbol_type) {
        case this.STOCK:
          promises.push(this.stockProvider.get_stock_by_symbol(data[index].symbol))
          break;

          case this.FOREX:
          promises.push( this.forexProvider.get_by_symbol(data[index].symbol));
          break;
      

          case this.CRYPTO:
          promises.push(this.cryptoProvider.get_by_symbol(data[index].symbol));
          break;
      
      
        default:
          break;
      }
     }
     promises
     Promise.all(promises).then((data)=>{
       for (let index = 0; index < data.length; index++) {
        this.sentiments.push(data[index]);
         
       }
       console.log(this.sentiments);
       
     }) 
    })
      .catch((err) => {
        console.log(err);

      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SentimentsPage');
  }

  close(item){
    console.log(item);
    
  }

}
