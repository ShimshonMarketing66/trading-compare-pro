import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStock } from '../../models/stock';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable()
export class StockProvider {

  public allStocks: {
    country: string;
    offset: number;
    data: IStock[];
  }[] = [];

  public topStocks: IStock[] = [];
  private readonly base_url: string = "https://websocket-stock.herokuapp.com/";  //http://localhost:5000/  // https://websocket-stock.herokuapp.com/
  private readonly path_getStock: string = "stocksPrice"; // path to 200 first top stocks
  private readonly path_search_stock: string = "searchStock"; // path to 200 first top stocks

  constructor(
    public http: HttpClient,
  ) {
    // let aa = new RmPointPipe()

  }


  getStocks(m_offset: number, m_country: string): Promise<IStock[]> {
    if (m_offset == undefined || m_offset<0) {
      m_offset = 0;
    }
    return new Promise((resolve, reject) => {
      let flag = false;
      for (let index = 0; index < this.allStocks.length; index++) {
        if (this.allStocks[index].country == m_country) {
          flag = true;
          if (this.allStocks[index].data.length != 0 && m_offset < this.allStocks[index].offset) {
            console.log("resolve dirrectly beacause it exist.");
            var tmp = [];
            for (let i = m_offset; i < m_offset + 200; i++) {
              if (i < this.allStocks[index].data.length)
                tmp.push(this.allStocks[index].data[i]);
              else break;
            }
            resolve(tmp);
          } else {
            this.http.get(this.base_url + this.path_getStock + "/" + m_offset + "/" + m_country)
              .toPromise()
              .then(data => {
                console.log("made requeust because the offset not append yet.");
                this.allStocks[index].offset = m_offset;
                var tmp = Object["values"](data) as IStock[];
                for (let j = 0; j < tmp.length; j++) {
                  tmp[j]["state"] = "none";
                  tmp[j]["index"] = j + (this.allStocks[index].data).length;                                    
                  tmp[j]["shortName"] = tmp[j]["name"].split(" ")[0];
                  let a = (data[index].symbol).split(".")[0];
                  tmp[j]["logo"] = "https://storage.googleapis.com/iex/api/logos/" + a + ".png";
                }
                for (let i = m_offset; i < m_offset + 200; i++) {
                  if (i < tmp.length)
                    this.allStocks[index].data.push(tmp[i]);
                  else break;
                }
                resolve(tmp);
              })
              .catch((err) => {
                console.error("err", err);
              })
          }
          break;
        }

      }

      if (!flag) {
        this.http.get(this.base_url + this.path_getStock + "/" + 0 + "/" + m_country)
          .toPromise()
          .then(data => {
            console.log("made requeust with offset 0 because never get this stock yet.");
            let data2 = Object["values"](data) as IStock[];
            for (let index = 0; index < data2.length; index++) {
              data2[index]["state"] = "none";
              data2[index]["index"] = index;
              data2[index]["shortName"] = data2[index]["name"].split(" ")[0];
              let a = (data[index].symbol).split(".")[0];
              data2[index]["logo"] = "https://storage.googleapis.com/iex/api/logos/" + a + ".png";
            }
            this.allStocks.push({
              data: data2,
              offset: data2.length,
              country: m_country
            })
            resolve(data2);
          })
          .catch((err) => {
            console.error("err", err);
          })
      }
    })
  }

  searchStock(m_str: string): Promise<IStock[]> {
    return new Promise((resolve, reject) => {
      this.http.get(this.base_url + this.path_search_stock + "/" + m_str)
        .toPromise()
        .then((data:any) => {
          for (let index = 0; index < data.length; index++) {
            let a = (data[index].symbol).split(".")[0];
            data[index]["logo"] = "https://storage.googleapis.com/iex/api/logos/" + a + ".png";
          }

          resolve(data as IStock[]);
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // getLogo(m_symbol): Promise<string> {
  //   console.log(m_symbol);
    
  //   return new Promise((resolve) => {
  //     let flag = false;
  //     for (let index = 0; index < this.allStocks.length; index++) {
  //       for (let j = 0; j < this.allStocks[index].data.length; j++) {
  //         if (m_symbol == this.allStocks[index].data[j].symbol) {
  //           flag = true;
  //           console.log("m_symbol == this.allStocks[index].data[j].symbol");
            
  //           if (this.allStocks[index].data[j]["logo"] != undefined) {
  //             resolve(this.allStocks[index].data[j]["logo"].changingThisBreaksApplicationSecurity);
  //             return;

  //           } else {
  //             this.http.get("https://api.iextrading.com/1.0/stock/" + m_symbol.toLowerCase() + "/logo")
  //               .toPromise()
  //               .then((data: any) => {
  //                 if (typeof data == "object") {
  //                   resolve(data.url);
  //                   return;
  //                 } else {
  //                   resolve("assets/imgs/stocks.png");
  //                   return;
  //                 }
  //               })
  //               .catch((err) => {
  //                 console.log("das",err);
  //                 resolve("assets/imgs/stocks.png");
  //               })
  //           }
  //         }

  //       }
  //     }
  //     if (!flag) {
  //       this.http.get("https://api.iextrading.com/1.0/stock/" + m_symbol.toLowerCase() + "/logo")
  //         .toPromise()
  //         .then((data: any) => {
  //           if (typeof data == "object") {
  //             resolve(data.url);
  //             return;
  //           } else {
  //             resolve("assets/imgs/stocks.png");
  //             return;
  //           }
  //         })
  //         .catch(() => {
  //           resolve("assets/imgs/stocks.png");
  //         })
  //     }
  //   })
  // }






}
