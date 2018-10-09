import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
declare var require: any;

@Injectable()
export class CryptoProvider {

  arrAllCrypto: any[] = [];
  cryptocurrencies;
  // private readonly base_url: string = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms="
  // private readonly base_url_CONTINUE: string = "&tsyms="
  constructor(public http: HttpClient) {
    this.cryptocurrencies = require('cryptocurrencies');
  }

  getAllCrypto(): Promise<any> {
    return new Promise((resolve) => {
      this.http.get("https://crypto.tradingcompare.com/AllPairs").toPromise()
        .then((data: any[]) => {
          console.log(data);

          let index = 0;
          for (const key in data) {
            if (this.cryptocurrencies[data[key]["fromSymbol"]] != undefined) {
              data[key]["name"] = this.cryptocurrencies[data[key]["fromSymbol"]];
              data[key]["shortName"] = data[key]["name"].split(" ")[0];
              data[key]["state"] = "none";
              data[key]["index"] = index;
              data[key]["logo"] = "https://cloud-marketing66.herokuapp.com/logo/" + (data[key]["fromSymbol"]);
              this.arrAllCrypto.push(data[key]);
              index++;
            } 
          }
          resolve(this.arrAllCrypto);
        })
    })
  }

  search(str: string): any {
    var arrToRetrun = [];
    for (let index = 0; index < this.arrAllCrypto.length; index++) {
      let pair = this.arrAllCrypto[index]["fromSymbol"] + this.arrAllCrypto[index]["toSymbol"];
      if (((pair.toLowerCase()).indexOf(str.toLowerCase())>-1)||(((this.arrAllCrypto[index]["pair"]).toLowerCase()).indexOf(str.toLowerCase())>-1)||(((this.arrAllCrypto[index]["name"]).toLowerCase()).indexOf(str.toLowerCase())>-1) ) {
        arrToRetrun.push(this.arrAllCrypto[index])
      }
    }
    return arrToRetrun;
  }

}
