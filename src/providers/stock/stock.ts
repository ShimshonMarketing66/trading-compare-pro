import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStock } from '../../models/stock';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthDataProvider } from '../auth-data/auth-data';


@Injectable()
export class StockProvider {

  public allStocks: {
    country: string;
    offset: number;
    data: IStock[];
  }[] = [];

  public topStocks: IStock[] = [];
  private readonly base_url: string = "https://websocket-stock.herokuapp.com/";  //https://xosignals.herokuapp.com/  // https://websocket-stock.herokuapp.com/
  private readonly path_getStock: string = "stocksPrice"; // path to 200 first top stocks
  private readonly path_search_stock: string = "searchStock"; // path to 200 first top stocks

  constructor(
    public http: HttpClient,
    public authData:AuthDataProvider
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

                  tmp[j]["is_in_watchlist"] = false;
                  tmp[j]["type"] = "STOCK";
                  for (let index = 0; index < this.authData.user.watchlist.length; index++) {
                    if (this.authData.user.watchlist[index].type == "STOCK") {
                      if (  tmp[j].symbol == this.authData.user.watchlist[index].symbol) {
                        tmp[j]["is_in_watchlist"] = true;
                        break;
                      }
                    }
                    
                  }
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
              data2[index]["is_in_watchlist"] = false;
              data2[index]["type"] = "STOCK";
              for (let index2 = 0; index2 < this.authData.user.watchlist.length; index2++) {
                if (this.authData.user.watchlist[index2].type == "STOCK") {
                  if (data2[index].symbol == this.authData.user.watchlist[index2].symbol) {
                    data2[index]["is_in_watchlist"] = true;
                    break;
                  }
                }
                
              }
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

  get_stock_by_symbol(symbol:string) :Promise<any>{
    return this.http.get("https://websocket-stock.herokuapp.com/getStockPrice/" + symbol ).toPromise();
    
  }


  get_stocks(m_offset: number, m_country: string): Promise<IStock[]> {
    console.log(m_offset);
    
    return new Promise((resolve,reject)=>{
      let isCountry = false;
      console.log(" this.allStocks.length", this.allStocks.length);
      
      for (let i = 0; i < this.allStocks.length; i++) {
        if (this.allStocks[i].country == m_country) {
          if (m_offset < this.allStocks[i].offset) {
            let arr = [];
            for (let j = m_offset; j <  this.allStocks[i].data.length && j-m_offset < 50; j++) {
              arr.push(this.allStocks[i].data[j]);
            }
            console.log("resolve directly.");
            resolve(arr);
          }else{
            this.http.get(this.base_url + this.path_getStock + "/" + m_offset + "/" + m_country)
            .toPromise()
            .then((data:IStock[])=>{
              console.log("made requeust with offset "+ m_offset+ ".");
                for (let index = 0; index < data.length; index++) {
                  data[index]["state"] = "none";
                  data[index]["index"] = index;
                  data[index]["shortName"] = data[index]["name"].split(" ")[0];
                  let a = (data[index].symbol).split(".")[0];
                  data[index]["logo"] = "https://storage.googleapis.com/iex/api/logos/" + a + ".png";
                  data[index]["is_in_watchlist"] = false;
                  data[index]["type"] = "STOCK";
                  for (let index2 = 0; index2 < this.authData.user.watchlist.length; index2++) {
                    if (this.authData.user.watchlist[index2].type == "STOCK") {
                      if (data[index].symbol == this.authData.user.watchlist[index2].symbol) {
                        data[index]["is_in_watchlist"] = true;
                        break;
                      }
                    }
                  }
                  this.allStocks[i].data.push(data[index]);
                }
                
                this.allStocks[i].offset =  this.allStocks[i].offset + data.length;
                resolve(data);
            })
            .catch(err=>{
              reject(err)
            })
          }
          isCountry = true;
        }
      }
      if (!isCountry) {
        this.http.get(this.base_url + this.path_getStock + "/" + 0 + "/" + m_country)
        .toPromise()
        .then((data:IStock[])=>{
          console.log("made requeust with offset 0 because never get this stock yet.");
            for (let index = 0; index < data.length; index++) {
              data[index]["state"] = "none";
              data[index]["index"] = index;
              data[index]["shortName"] = data[index]["name"].split(" ")[0];
              let a = (data[index].symbol).split(".")[0];
              data[index]["logo"] = "https://storage.googleapis.com/iex/api/logos/" + a + ".png";
              data[index]["is_in_watchlist"] = false;
              data[index]["type"] = "STOCK";
              for (let index2 = 0; index2 < this.authData.user.watchlist.length; index2++) {
                if (this.authData.user.watchlist[index2].type == "STOCK") {
                  if (data[index].symbol == this.authData.user.watchlist[index2].symbol) {                    
                    data[index]["is_in_watchlist"] = true;
                    break;
                  }
                }
              }
            }
            this.allStocks.push({
              data: data,
              offset: data.length,
              country: m_country
            })
            resolve(data);
        })
        .catch(err=>{
          reject(err)
        })
      }
    })
  }






}
