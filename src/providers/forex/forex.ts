import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDataProvider } from '../auth-data/auth-data';

@Injectable()
export class ForexProvider {

  allForex: any[] = [];
  
  constructor(public http: HttpClient,public authData:AuthDataProvider) {

  }


  getAllForex(): Promise<any[]> {
    return new Promise((resolve) => {
      if (this.allForex.length < 1) {
        this.http.get("https://forex-websocket.herokuapp.com/all_data")
          .toPromise()
          .then((data) => {
            let index = 0;
            for (const key in data) {
              data[key]["state"] = "none";
              data[key]["symbol"] = data[key].pair[0] + data[key].pair[1] + data[key].pair[2];
              data[key]["toSymbol"] = data[key].pair[3] + data[key].pair[4] + data[key].pair[5]
              data[key]["index"] = index;
              data[key]["logo"] = "https://xosignals.herokuapp.com/api2/sendImgByName/" + (data[key]["symbol"]).toLowerCase() + "%20" + data[key]["toSymbol"].toLowerCase();
              data[key]["is_in_watchlist"] = false;
              data[key]["symbol"] = data[key]["pair"];
              data[key]["type"] = "FOREX";
              for (let index = 0; index < this.authData.user.watchlist.length; index++) {
                if (this.authData.user.watchlist[index].type == "FOREX") {
                  if ( data[key].symbol == this.authData.user.watchlist[index].symbol) {
                    console.log(data[key].symbol);
                    
                    data[key]["is_in_watchlist"] = true;
                    break;
                  }
                }
                
              }
              this.allForex.push(data[key])
              index++;
            }

            resolve(this.allForex);
          })
      } else {
        resolve(this.allForex)
      }
    })
  }

  getForex(num:number): Promise<any[]> {
    return new Promise((resolve) => {
      if (this.allForex.length < 1) {
        this.http.get("https://forex-websocket.herokuapp.com/all_data")
          .toPromise()
          .then((data) => {
            let index = 0;
            for (const key in data) {
              data[key]["state"] = "none";
              data[key]["symbol"] = data[key].pair[0] + data[key].pair[1] + data[key].pair[2];
              data[key]["toSymbol"] = data[key].pair[3] + data[key].pair[4] + data[key].pair[5]
              data[key]["index"] = index;
              data[key]["logo"] = "https://xosignals.herokuapp.com/api2/sendImgByName/" + (data[key]["symbol"]).toLowerCase() + "%20" + data[key]["toSymbol"].toLowerCase();
              data[key]["is_in_watchlist"] = false;
              data[key]["symbol"] = data[key]["pair"];
              data[key]["type"] = "FOREX";
              for (let index = 0; index < this.authData.user.watchlist.length; index++) {
                if (this.authData.user.watchlist[index].type == "FOREX") {
                  if ( data[key].symbol == this.authData.user.watchlist[index].symbol) {
                    console.log(data[key].symbol);
                    
                    data[key]["is_in_watchlist"] = true;
                    break;
                  }
                }
                
              }
            
              this.allForex.push(data[key])
              index++;
            }
            let arr = [];
            for (let index = num; index < this.allForex.length&&index-num<50; index++) {
              arr.push(this.allForex[index])
            }
            resolve(arr);
          })
      } else {
        let arr = [];
        for (let index = num; index < this.allForex.length && index-num < 50 ; index++) {
          arr.push(this.allForex[index])
        }
        resolve(arr);
      }
    })
  }

  search(str: string) {
    var arrToRetrun = [];
    for (let index = 0; index < this.allForex.length; index++) {
      if (((this.allForex[index]["pair"]).toLowerCase()).indexOf(str.toLowerCase())>-1) {
        arrToRetrun.push(this.allForex[index])
      }
    }    
    return arrToRetrun;
  }

}


