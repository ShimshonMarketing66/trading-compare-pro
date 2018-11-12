import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StockProvider } from '../stock/stock';
import { CryptoProvider } from '../crypto/crypto';
import { ForexProvider } from '../forex/forex';
import { AuthDataProvider } from '../auth-data/auth-data';

@Injectable()
export class GlobalProvider {

  constructor
  ( public http: HttpClient,
    public cryptoProvider:CryptoProvider,
    public stockProvider:StockProvider,
    public forexProvider:ForexProvider,
    public authData:AuthDataProvider
  ) {
   
  }
  add_to_watchlist(symbol:string,type:string){
    let dataTOSEND = {
      data:{
        symbol:symbol,
        type:type
      },
      _id:this.authData.user._id
    }
    this.http.post("https://xosignals.herokuapp.com/trading-compare-v2/add-to-watchlist",dataTOSEND)
    .toPromise()
    .then(data=>{
      console.log(symbol + " added");
      this.authData.user.watchlist.push(dataTOSEND.data);
    })
    .catch(err=>{
      console.log("err",err);
      
    })
  }

  remove_from_watchlist(symbol:string,type:string){

    for (let index = 0; index < this.authData.user.watchlist.length; index++) {
      if (this.authData.user.watchlist[index].symbol == symbol) {
        this.authData.user.watchlist.splice(index, 1);
        break;
      }
    }
    let dataTOSEND = {
      data:{
        symbol:symbol,
        type:type
      },
      _id:this.authData.user._id
    }
    this.http.post("https://xosignals.herokuapp.com/trading-compare-v2/remove-from-watchlist",dataTOSEND)
    .toPromise()
    .then(data=>{
      console.log(symbol + " removed");
      this.authData.user.watchlist.push(dataTOSEND.data);
    })
    .catch(err=>{
      console.log("err",err);
      
    })
  }

}
