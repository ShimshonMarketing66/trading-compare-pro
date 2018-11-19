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
    return new Promise((resolve)=>{
      this.http.get("https://websocket-stock.herokuapp.com/getStockPrice/" + symbol )
      .toPromise()
      .then((data:any)=>{

        data["type"] = "STOCK";
        data["state"] = "none";
        data["sentiment"] = "none";
        data["shortName"] = data["name"].split(" ")[0];
        let a = (data.symbol).split(".")[0];
        data["logo"] = "https://storage.googleapis.com/iex/api/logos/" + a + ".png";
        data["is_in_watchlist"] = true;        
        resolve(data);
      })
      .catch((err)=>{
        console.error(err);
        resolve(err)
      })
    })
    
  }


  get_stocks(m_offset: number, m_country: string): Promise<IStock[]> {
    
    return new Promise((resolve,reject)=>{
      let isCountry = false;      
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
                  data[index]["sentiment"] = "none";
                  data[index]["status"] = "CLOSE";

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
              data[index]["sentiment"] = "none";
              data[index]["state"] = "none";
              data[index]["status"] = "CLOSE";
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
