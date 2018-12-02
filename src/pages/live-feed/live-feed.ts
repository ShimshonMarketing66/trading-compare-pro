import { Component, HostListener, ViewChild, AfterViewInit, NgZone, ElementRef, trigger, transition, animate, keyframes, style } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController, ModalOptions, Platform, Content, AlertController } from 'ionic-angular';
import { StockProvider } from '../../providers/stock/stock';
import { IStock } from '../../models/stock';
import { ForexProvider } from '../../providers/forex/forex';
import * as io from "socket.io-client";
import { CryptoProvider } from '../../providers/crypto/crypto';
import { GlobalProvider } from '../../providers/global/global';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';

@HostListener('scroll', ['$event'])
@HostListener("click", ["$event"])

@IonicPage({
  name: "live-feed"
})
@Component({
  selector: 'page-live-feed',
  templateUrl: 'live-feed.html',
  animations: [
    trigger("changeBackgroundColor", [
      transition("falling1 => falling, falling => falling1,raising => falling,raising => falling1,raising1 => falling,raising1 => falling1,none => falling,none => falling1",
        [
          animate("0.6s",
            keyframes([
              style({ color: "#e34c47", offset: 0 }),
              style({ backgroundColor: "#e34c47", offset: 0, opacity: 0.5 }),
              style({ backgroundColor: "#2b2b2b", offset: 1 })
            ])
          )]
      ),
      transition("raising1 => raising, raising => raising1,falling => raising,falling => raising1,falling1 => raising,falling1 => raising1,none => raising1,none => raising",
        [
          animate("0.6s",
            keyframes([
              style({ backgroundColor: "#91c353", opacity: 0.5 }),
              style({ backgroundColor: "#2b2b2b", })
            ])
          )]
      )
    ])
  ]
})
export class LiveFeedPage implements AfterViewInit {
  /*  DEFINITIONS CONSTANTS*/
  private readonly STOCK: string = "STOCK";
  private readonly FOREX: string = "FOREX";
  private readonly CRYPTO: string = "CRYPTO";
  private readonly WATCHLIST: string = "WATCHLIST";
  private readonly TRENDING: string = "TRENDING";

  /*  END DEFINITIONS CONSTANTS*/

  private readonly sizeOfLine: number = 40;
  sizeOfBody: number;
  numOfLines: number;
  @ViewChild('mySlider') slider: Slides;
  @ViewChild('content') content: Content;
  modeView: string = "LINES"

  watchlists = [];
  /* CRYPTO */
  CoinConnectedWSCrypto: any[] = [];
  ScrollFromTopCrypto: number = 0;
  ScrollDoneCrypto: boolean = true;
  socketCrypto: SocketIOClient.Socket;
  /* END CRYPTO */

  /* FOREX */
  CoinConnectedWSForex: any[] = [];
  ScrollFromTopForex: number = 0;
  socketForex: SocketIOClient.Socket;
  /* END FOREX */

  /* STOCK */
  CoinConnectedWSStock: any[] = [];
  ScrollFromTopStock: number = 0;
  socketStock: SocketIOClient.Socket;
  /* END STOCK */


  /* DEFINITIONS ALL ARRAYS */
  offsetRequested: number = 0;
  stockOffset: number = 0;
  exchangeStock: string = "united-states-of-america";
  /*  END DEFINITIONS ALL ARRAYS */


  socketCryptoWL: SocketIOClient.Socket;
  socketForexWL: SocketIOClient.Socket;
  socketStockWL: SocketIOClient.Socket;

  slides: string[];

  public selectedSegment: string = this.STOCK;
  public Segments: Array<string> = [this.STOCK, this.FOREX, this.CRYPTO, this.WATCHLIST];


  constructor(
    private alertCtrl: AlertController,
    public authData: AuthDataProvider,
    public toastCtrl: ToastController,
    public globalProvider: GlobalProvider,
    public cryptoProvider: CryptoProvider,
    public platform: Platform,
    public forexProvider: ForexProvider,
    public zone: NgZone,
    public modalCtrl: ModalController,
    public stockProvider: StockProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.sizeOfBody = window.screen.height - (this.platform.is("ios") ? 180 : 199);
    this.numOfLines = Math.ceil(this.sizeOfBody / this.sizeOfLine);

    this.slides = [this.STOCK, this.FOREX, this.CRYPTO, this.WATCHLIST];
    this.buildStocks(0).then((arr) => {
      this.offsetRequested = 50;
      this.startWS(this.STOCK);
      this.addCoinWebsocketStock(arr);
    })



  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LiveFeedPage');
  }

  ngAfterViewInit(): void {
    //     setTimeout(()=>{
    //       this.slider.autoHeight = true;
    // console.log("asd");

    //     },10000)

  }


  onTabChanged(tabName) {
    this.changeSegment(tabName);
  }

  changeSegment(segment) {
    this.offsetRequested = 0;
    if (this.selectedSegment == segment) {
      this.content.scrollToTop(1000);
    } else {
      this.content.scrollToTop(0);
    }

    this.stopWS(this.selectedSegment);
    switch (this.selectedSegment) {
      case this.STOCK:
        this.stockProvider.stocks = [];
        break;
      case this.FOREX:
        this.forexProvider.forexs = [];
      case this.CRYPTO:
        this.cryptoProvider.cryptos = [];
      case this.WATCHLIST:
        // this.globalProvider.watchlists = [];
        break;
      case this.TRENDING:
        break;
      default:
        break;
    }

    switch (segment) {
      case this.STOCK:
        this.buildStocks(0).then((arr) => {
          this.offsetRequested += 50;
          if (this.modeView != "SQUARES") {
            this.startWS(this.STOCK);
            this.addCoinWebsocketStock(arr);
          }
        });
        break;
      case this.FOREX:
        this.buildForex().then((arr) => {
          this.offsetRequested += 50;
          if (this.modeView != "SQUARES") {
            console.log("arr",arr);
            
            this.startWS(this.FOREX);
            this.addCoinWebsocketForex(arr);
          }
        })
        break;
      case this.CRYPTO:
        this.buildCrypto().then((arr) => {
          if (this.modeView != "SQUARES") {
            this.startWS(this.CRYPTO);
          this.addCoinWebsocketCrypto(arr);
          }
          this.offsetRequested += 50;
        })
        break;
      case this.WATCHLIST:
         this.startWS(this.WATCHLIST);
        break;
      case this.TRENDING:
        break;
      default:
        break;
    }
    this.selectedSegment = segment;
  }

  openSearch() {
    let profileModal;
    switch (this.selectedSegment) {
      case this.STOCK:
        profileModal = this.modalCtrl.create("search-stock-page");
        break;
      case this.FOREX:
        profileModal = this.modalCtrl.create("search-forex-page");
        break;
      case this.CRYPTO:
        profileModal = this.modalCtrl.create("search-crypto-page");
        break;
      case this.WATCHLIST:
        // this.selectedSegment = this.WATCHLIST;
        break;
      case this.TRENDING:
        // this.selectedSegment = this.TRENDING;
        break;
      default:
        break;
    }
    profileModal.present();
  }

  openCountries() {
    const option: ModalOptions = {
      cssClass: "countries-popup",
      showBackdrop: false
    }
    let profileModal = this.modalCtrl.create("country-modal", {}, option);
    profileModal.present();
    profileModal.onDidDismiss((data) => {
      if (data == undefined || data == this.exchangeStock) {
        return;
      }

      this.exchangeStock = data;
      this.stockProvider.get_stocks(0, this.exchangeStock).then((data) => {
        this.stockProvider.stocks = data;
        this.stockOffset = data.length;
        this.offsetRequested = 50;
      })
    })
  }

  doInfinite() {
    console.log("do infinit", this.selectedSegment);
    return new Promise((resolve) => {
      switch (this.selectedSegment) {
        case this.STOCK:
          this.stockProvider.get_stocks(this.offsetRequested, this.exchangeStock)
            .then(data => {
              this.offsetRequested += data.length;
              for (let index = 0; index < data.length; index++) {
                for (let index2 = 0; index2 < this.globalProvider.sentiments.length; index2++) {
                 if (this.globalProvider.sentiments[index2].symbol == data[index].symbol) {
                  data[index]["sentiment"] = this.globalProvider.sentiments[index2].type;
                 }
                }
                this.stockProvider.stocks.push(data[index]);
              }
              resolve();
            })
            .catch(err => {
              console.error(err);
              resolve();
            })
          break;
        case this.FOREX:
          this.forexProvider.getForex(this.offsetRequested)
            .then(data => {
              this.offsetRequested += data.length;
              for (let index = 0; index < data.length; index++) {
                this.forexProvider.forexs.push(data[index]);
              }
              resolve();
            })
            .catch(err => {
              console.error(err);
              resolve();
            })
          break;
        case this.CRYPTO:
          this.cryptoProvider.getCrypto(this.offsetRequested)
            .then(data => {
              this.offsetRequested += data.length;
              for (let index = 0; index < data.length; index++) {
                this.cryptoProvider.cryptos.push(data[index]);
              }
              resolve();
            })
            .catch(err => {
              console.error(err);
              resolve();
            })
          break;

        default:
          break;
      }
    })
  }

  goToDetailsStock(i: number) {
    this.navCtrl.push("item-details-stock", {
      item: this.stockProvider.stocks[i], 
      change_sentiment:this.change_sentiment
    })
  }

  goToDetailsForex(i: number) {
    this.navCtrl.push("item-details-forex", {
      item: this.forexProvider.forexs[i],   
      change_sentiment:this.change_sentiment
    })
  }

  goToDetailsCrypto(i: number) {
    this.navCtrl.push("item-details-crypto", {
      item: this.cryptoProvider.cryptos[i],
      change_sentiment:this.change_sentiment
    })
  }

  buildWatchlist(): Promise<any> {
    return new Promise((resolve) => {
      let promises = [this.forexProvider.getAllForex(), this.cryptoProvider.getCrypto()];
      for (let index = 0; index < this.authData.user.watchlist.length; index++) {
        if (this.authData.user.watchlist[index].type == this.STOCK) {
          promises.push(this.stockProvider.get_stock_by_symbol(this.authData.user.watchlist[index].symbol));
        }
      }
      Promise.all(promises).then((data: any[]) => {
        console.log(data);

        for (let i = 0; i < this.authData.user.watchlist.length; i++) {
          switch (this.authData.user.watchlist[i].type) {
            case this.FOREX:
              for (let j = 0; j < data[0].length; j++) {
                if (data[0][j].symbol == this.authData.user.watchlist[i].symbol) {
                  this.globalProvider.watchlists.push(data[0][j]);
                  break;
                }
              }
              break;
            case this.CRYPTO:
              for (let j = 0; j < data[1].length; j++) {
                if (data[1][j].symbol == this.authData.user.watchlist[i].symbol) {
                  this.globalProvider.watchlists.push(data[1][j]);
                  break;
                }
              }
              break;
            case this.STOCK:
            console.log(data,this.globalProvider.sentiments);
            
              for (let j = 2; j < data.length; j++) {
                if (data[j].symbol == this.authData.user.watchlist[i].symbol) {
                  for (let aaa = 0; aaa < this.globalProvider.sentiments.length; aaa++) {
                   if (this.globalProvider.sentiments[aaa].symbol == data[j].symbol) {
                     if (this.globalProvider.sentiments[aaa].status == "OPEN") {
                      data[j]["status"]= "OPEN";
                      data[j]["sentiment"]= this.globalProvider.sentiments[aaa].type;
                      break;
                     }else{
                      data[j]["status"]= "CLOSE";
                      data[j]["sentiment"]= this.globalProvider.sentiments[aaa].type;
                     }
                   }
                  }
                  this.globalProvider.watchlists.push(data[j]);
                  break;
                }
              }
              break;

            default:
              break;
          }
        }
        resolve();

      })
    })
  }
 
  buildForex(): Promise<any> {
    return new Promise((resolve) => {
      this.forexProvider.getForex(0).then(data => {
        for (let index = 0; index < data.length; index++) {
          this.forexProvider.forexs.push(data[index]);
        }
        let arr = [];
        this.CoinConnectedWSForex = [];
        for (let index = 0; index < this.forexProvider.forexs.length; index++) { 
          if (index < this.numOfLines) {
            this.CoinConnectedWSForex.push(data[index]);
            arr.push(data[index].pair);
          }
        }
        resolve(arr);
      })
    })
  }

  buildCrypto(): Promise<any> {
    return new Promise((resolve) => {
      this.cryptoProvider.getCrypto(0).then(data => {
        for (let index = 0; index < data.length; index++) {
          this.cryptoProvider.cryptos.push(data[index]);
        }
        let arr = [];
        for (let index = 0; index < this.cryptoProvider.cryptos.length; index++) {
          if (index < this.numOfLines) {
            this.CoinConnectedWSCrypto.push(data[index]);
            arr.push(data[index].pair);
          }
        }
        resolve(arr)
      })
    })
  }

  buildStocks(stockOffset?: number): Promise<any> {
    return new Promise((resolve) => {
      this.stockProvider.get_stocks(stockOffset, this.exchangeStock).then(async (data) => {
        for (let index = 0; index < data.length; index++) {
          this.stockProvider.stocks.push(data[index]);
        }
        this.offsetRequested = this.stockProvider.stocks.length;
        let arr = [];
        for (let index = 0; index < this.stockProvider.stocks.length; index++) {
          this.stockProvider.stocks[index]["index"] = index;
          if (index < this.numOfLines) {
            this.CoinConnectedWSStock.push(data[index]);
            arr.push(data[index].symbol);
          }
        }
        resolve(arr);
      })
    })
  }
  foo() {

    console.log(this.globalProvider.watchlists);

  }


  async onScroll(event) {
    console.log("onScroll");

    if (event == undefined) return;
    if (this.modeView == "SQUARES") {
      return;
    } else {
      switch (this.selectedSegment) {
        case this.CRYPTO:
          if (this.socketCrypto != undefined && !this.socketCrypto.disconnected) {
            this.checkWsCrypto(event.scrollTop);
          }
          break;
        case this.FOREX:
          if (this.socketForex != undefined && !this.socketForex.disconnected) {
            this.checkWsForex(event.scrollTop);
          }
          break;
        case this.STOCK:
          if (this.socketStock != undefined && !this.socketStock.disconnected) {
            this.checkWsStock(event.scrollTop);
          }
          break;
        case this.TRENDING:
        // trending
        default:
          // watchlist
          break;
      }

    }
  }


  stopWS(str: string) {
    console.log("stop ws", str);

    switch (str) {
      case this.CRYPTO:
        if (this.socketCrypto != undefined) {
          this.socketCrypto.disconnect();
        }
        break;
      case this.FOREX:
        if (this.socketForex != undefined) {
          this.socketForex.disconnect();
        }
        break;
      case this.STOCK:
        if (this.socketStock != undefined) {
          this.socketStock.disconnect();
        }
        break;
      case this.TRENDING:
      // trending
      default:
        // watchlist
        break;
    }
  }

  startWS(str: string) {    
    switch (str) {
      case this.CRYPTO:
        this.socketCrypto = io.connect("https://crypto.tradingcompare.com/");

        this.socketCrypto.on("message", (data) => {
          let pair = data.pair;
          if (this.cryptoProvider.cryptos.length == 0) {
            this.socketCrypto.disconnect();
            return;
          }
          for (let index = 0; index < this.CoinConnectedWSCrypto.length; index++) {
            let a = this.CoinConnectedWSCrypto[index]["index"];
            if (pair == this.CoinConnectedWSCrypto[index].pair) {
              if (this.cryptoProvider.cryptos[a].price > Number(data.price)) {
                this.cryptoProvider.cryptos[a].state = this.cryptoProvider.cryptos[a].state == "falling" ? "falling1" : "falling";
                this.cryptoProvider.cryptos[a].price = Number(data.price);
                this.cryptoProvider.cryptos[a].high24 = Number(data.high24);
                this.cryptoProvider.cryptos[a].low24 = Number(data.low24);
                this.cryptoProvider.cryptos[a].change24 = Number(data.change24);
              } else if (this.cryptoProvider.cryptos[a].price < Number(data.price)) {
                this.cryptoProvider.cryptos[a].state = this.cryptoProvider.cryptos[a].state == "raising" ? "raising1" : "raising";
                this.cryptoProvider.cryptos[a].price = Number(data.price);
                this.cryptoProvider.cryptos[a].high24 = Number(data.high24);
                this.cryptoProvider.cryptos[a].low24 = Number(data.low24);
                this.cryptoProvider.cryptos[a].change24 = Number(data.change24);
              }

              break;
            }
          }
        })

        break;


      case this.FOREX:
        this.socketForex = io.connect("https://forex-websocket.herokuapp.com/", {
          path: "/socket/forex/livefeed"
        });
        this.socketForex.on("message", (data) => {
          if (this.socketForex.disconnected) {
            return;
          }
          let pair = data.pair;
          for (let index = 0; index < this.CoinConnectedWSForex.length; index++) {
            if (pair == this.CoinConnectedWSForex[index].pair) {
              let a = this.CoinConnectedWSForex[index].index;
              if (this.forexProvider.forexs[a].price > data.price) {
                this.forexProvider.forexs[a].state = this.forexProvider.forexs[a].state == "falling" ? "falling1" : "falling";
                this.forexProvider.forexs[a].price = Number(data.price);
                this.forexProvider.forexs[a].high24 = Number(data.high24);
                this.forexProvider.forexs[a].low24 = Number(data.low24);
                this.forexProvider.forexs[a].change24 = Number(data.change24);
              } else if (this.forexProvider.forexs[a].price < data.price) {
                this.forexProvider.forexs[a].state = this.forexProvider.forexs[a].state == "raising" ? "raising1" : "raising";
                this.forexProvider.forexs[a].price = Number(data.price);
                this.forexProvider.forexs[a].high24 = Number(data.high24);
                this.forexProvider.forexs[a].low24 = Number(data.low24);
                this.forexProvider.forexs[a].change24 = Number(data.change24);
              }

              break;
            }
          }
        })
        break;


      case this.STOCK:
        this.socketStock = io.connect("https://ws-api.iextrading.com/1.0/last");
        this.socketStock.on("message", (data) => {
          data = JSON.parse(data);
          let pair = data.symbol;
          for (let index = 0; index < this.CoinConnectedWSStock.length; index++) {
            if (pair == this.CoinConnectedWSStock[index].symbol) {
              let a = this.CoinConnectedWSStock[index].index;
              if (Number(this.stockProvider.stocks[a].price) > data.price) {
                this.stockProvider.stocks[a]["state"] = this.stockProvider.stocks[a]["state"] == "falling" ? "falling1" : "falling";
              } else if (Number(this.stockProvider.stocks[a].price) < data.price) {
                this.stockProvider.stocks[a]["state"] = this.stockProvider.stocks[a]["state"] == "raising" ? "raising1" : "raising";
              }

              if (Number(data.price) > Number(this.stockProvider.stocks[a].day_high)) {
                this.stockProvider.stocks[a].day_high = data.price;
              }

              if (Number(data.price) < Number(this.stockProvider.stocks[a].day_low)) {
                this.stockProvider.stocks[a].day_low = data.price;
              }

              console.log(data.price,pair);
              
              
              let original = Number(this.stockProvider.stocks[a].price_open);
              if (isNaN(original) || original == undefined || original == null ) {
                original = 0;
                return;
              }
              let neww = Number(data.price);

              this.stockProvider.stocks[a].change_pct = (((neww - original) / original) * 100).toString()
              this.stockProvider.stocks[a].price = (Number(data.price)).toString();
              break;
            }
          }
        })
        break;
      case this.WATCHLIST:      
      this.socketStockWL = io.connect("https://ws-api.iextrading.com/1.0/last");
      this.socketForexWL = io.connect("https://forex-websocket.herokuapp.com/", {
        path: "/socket/forex/livefeed"
      });
      this.socketCryptoWL = io.connect("https://crypto.tradingcompare.com/");
        this.add_coins_Watchlist_WS();
        break;
      // trending
      default:
        // watchlist
        break;
    }
  }

  add_coins_Watchlist_WS(){
    for (let index = 0; index < this.globalProvider.watchlists.length; index++) {
     switch (this.globalProvider.watchlists[index]["type"]) {
       case this.STOCK:
       
         this.socketStockWL.emit("subscribe",this.globalProvider.watchlists[index].symbol);
        
         break;

         case this.FOREX:
         console.log(this.globalProvider.watchlists[index].symbol + "_2sec");
         
         this.socketForexWL.emit("room",this.globalProvider.watchlists[index].symbol + "_2sec");
         break;

         case this.CRYPTO:
         console.log(this.globalProvider.watchlists[index].symbol);

         this.socketCryptoWL.emit("room",this.globalProvider.watchlists[index].symbol);
         break;
     
       default:
         break;
     }
    }
    this.socketStockWL.on("message", (data) => {
      data = JSON.parse(data);
      let pair = data.symbol;
      for (let index = 0; index < this.globalProvider.watchlists.length; index++) {
        if (pair == this.globalProvider.watchlists[index].symbol) {
          
          if (Number(this.globalProvider.watchlists[index].price) > data.price) {
            this.globalProvider.watchlists[index]["state"] =this.globalProvider.watchlists[index]["state"] == "falling" ? "falling1" : "falling";
          } else if (Number(this.globalProvider.watchlists[index].price) < data.price) {
            this.globalProvider.watchlists[index]["state"] = this.globalProvider.watchlists[index]["state"] == "raising" ? "raising1" : "raising";
          }

          if (Number(data.price) > Number(this.globalProvider.watchlists[index].day_high)) {
            this.globalProvider.watchlists[index].day_high = data.price;
          }

          if (Number(data.price) < Number(this.globalProvider.watchlists[index].day_low)) {
            this.globalProvider.watchlists[index].day_low = data.price;
          }

          let original = Number(this.globalProvider.watchlists[index].price_open);
          let neww = Number(data.price);

          this.globalProvider.watchlists[index].change_pct = (((neww - original) / original) * 100).toString()
          this.globalProvider.watchlists[index].price = (Number(data.price)).toString();
          break;
        }
      }
      
    })

    this.socketForexWL.on("message", (data) => {
      let pair = data.pair;
      for (let index = 0; index < this.globalProvider.watchlists.length; index++) {
        if (pair == this.globalProvider.watchlists[index].pair) {
          
          if (this.globalProvider.watchlists[index].price > data.price) {
            this.globalProvider.watchlists[index].state = this.globalProvider.watchlists[index].state == "falling" ? "falling1" : "falling";
            this.globalProvider.watchlists[index].price = Number(data.price);
            this.globalProvider.watchlists[index].high24 = Number(data.high24);
            this.globalProvider.watchlists[index].low24 = Number(data.low24);
            this.globalProvider.watchlists[index].change24 = Number(data.change24);
          } else if (this.globalProvider.watchlists[index].price < data.price) {
            this.globalProvider.watchlists[index].state = this.globalProvider.watchlists[index].state == "raising" ? "raising1" : "raising";
            this.globalProvider.watchlists[index].price = Number(data.price);
            this.globalProvider.watchlists[index].high24 = Number(data.high24);
            this.globalProvider.watchlists[index].low24 = Number(data.low24);
            this.globalProvider.watchlists[index].change24 = Number(data.change24);
          }

          break;
        }
      }
    })

    this.socketCryptoWL.on("message", (data) => {
         let pair = data.pair;
          for (let index = 0; index < this.globalProvider.watchlists.length; index++) {
            if (pair ==  this.globalProvider.watchlists[index].pair) {
              if ( this.globalProvider.watchlists[index].price > Number(data.price)) {
                this.globalProvider.watchlists[index].state =  this.globalProvider.watchlists[index].state == "falling" ? "falling1" : "falling";
                this.globalProvider.watchlists[index].price = Number(data.price);
                this.globalProvider.watchlists[index].high24 = Number(data.high24);
                this.globalProvider.watchlists[index].low24 = Number(data.low24);
                this.globalProvider.watchlists[index].change24 = Number(data.change24);
              } else if ( this.globalProvider.watchlists[index].price < Number(data.price)) {
                this.globalProvider.watchlists[index].state =  this.globalProvider.watchlists[index].state == "raising" ? "raising1" : "raising";
                this.globalProvider.watchlists[index].price = Number(data.price);
                this.globalProvider.watchlists[index].high24 = Number(data.high24);
                this.globalProvider.watchlists[index].low24 = Number(data.low24);
                this.globalProvider.watchlists[index].change24 = Number(data.change24);
              }
            }
          }
        })
  }

  addCoinWebsocketStock(arr: string[]) {
    // console.log("addCoinWebsocketStock", arr);
    let str = ""
    for (let index = 0; index < arr.length; index++) {
      str += arr[index];
      if (index != arr.length - 1) {
        str += ","
      }
    }
    if (this.socketStock != undefined) {
      this.socketStock.emit("subscribe", str);
    } else {
      console.log("this.socketStock!=undefined");
    }
  }

  leaveCoinWebsocketStock(arr: string[]) {
    // console.log("leaveCoinWebsocketStock", arr);
    let str = "";
    for (let index = 0; index < arr.length; index++) {
      str += arr[index];
      if (index == arr.length - 1) {
        str += ","
      }
    }
    this.socketStock.emit("unsubscribe", str);
  }

  addCoinWebsocketForex(arr: string[]) {
    console.log("addCoinWebsocketForex", arr);
    for (let index = 0; index < arr.length; index++) {
      arr[index] += "_2sec";
    }
    this.socketForex.emit("room", arr);
  }

  leaveCoinWebsocketForex(arr: string[]) {
    console.log("leaveCoinWebsocketForex", arr);
    for (let index = 0; index < arr.length; index++) {
      arr[index] += "_2sec";
      this.socketForex.emit("leave_room", arr);
    }
  }

  addCoinWebsocketCrypto(arr: string[]) {
    console.log(arr);

    this.socketCrypto.emit("room", arr);
  }

  leaveCoinWebsocketCrypto(arr: string[]) {
    this.socketCrypto.emit("leave_room", arr);
  }

  checkWsCrypto(scrollPx: number) {
    var SuposedToBe = [];
    var Todisconect = [];
    var Toconect = [];
    let a = Math.ceil(scrollPx / this.sizeOfLine) - 2;
    for (let j = 0; j < this.numOfLines; j++) {
      if (a + j > -1 && this.cryptoProvider.cryptos[a + j] != undefined) {
        SuposedToBe.push(this.cryptoProvider.cryptos[a + j]);
      }
    }
    for (let j1 = 0; j1 < SuposedToBe.length; j1++) {
      let flag1 = false;
      for (let j2 = 0; j2 < this.CoinConnectedWSCrypto.length; j2++) {
        if (this.CoinConnectedWSCrypto[j2].pair == SuposedToBe[j1].pair) {
          flag1 = true;
        }
      }
      if (!flag1) {
        Toconect.push(SuposedToBe[j1].pair);
      }
    }

    for (let j1 = 0; j1 < this.CoinConnectedWSCrypto.length; j1++) {
      let flag2 = false;
      for (let j2 = 0; j2 < SuposedToBe.length; j2++) {
        if (this.CoinConnectedWSCrypto[j1].pair == SuposedToBe[j2].pair) {
          flag2 = true;
        }
      }
      if (!flag2) {
        Todisconect.push(this.CoinConnectedWSCrypto[j1].pair);
      }
    }

    // console.log(Toconect);
    // console.log(Todisconect);



    this.addCoinWebsocketCrypto(Toconect);
    this.leaveCoinWebsocketCrypto(Todisconect);
    this.CoinConnectedWSCrypto = SuposedToBe;
  }


  checkWsForex(scrollPx) {
    var SuposedToBe = [];
    var Todisconect = [];
    var Toconect = [];
    let a = Math.ceil(scrollPx / this.sizeOfLine) - 2;
    for (let j = 0; j < this.numOfLines; j++) {
      if (a + j > -1 && this.forexProvider.forexs[a + j] != undefined) {
        SuposedToBe.push(this.forexProvider.forexs[a + j]);
      }
    }

    for (let j1 = 0; j1 < SuposedToBe.length; j1++) {
      let flag1 = false;
      for (let j2 = 0; j2 < this.CoinConnectedWSForex.length; j2++) {
        if (this.CoinConnectedWSForex[j2].pair == SuposedToBe[j1].pair) {
          flag1 = true;
        }
      }
      if (!flag1) {
        Toconect.push(SuposedToBe[j1].pair);
      }
    }

    for (let j1 = 0; j1 < this.CoinConnectedWSForex.length; j1++) {
      let flag2 = false;
      for (let j2 = 0; j2 < SuposedToBe.length; j2++) {
        if (this.CoinConnectedWSForex[j1].pair == SuposedToBe[j2].pair) {
          flag2 = true;
        }
      }
      if (!flag2) {
        Todisconect.push(this.CoinConnectedWSForex[j1].pair);
      }
    }

    // console.log(Toconect);
    // console.log(Todisconect);



    this.addCoinWebsocketForex(Toconect);
    this.leaveCoinWebsocketForex(Todisconect);
    this.CoinConnectedWSForex = SuposedToBe;
  }

  checkWsStock(scrollPx) {
    var SuposedToBe = [];
    var Todisconect = [];
    var Toconect = [];
    let a = Math.ceil(scrollPx / this.sizeOfLine) - 2;
    for (let j = 0; j < this.numOfLines; j++) {
      if (a + j > -1 && this.stockProvider.stocks[a + j] != undefined) {
        SuposedToBe.push(this.stockProvider.stocks[a + j]);
      }
    }
    // console.log("SuposedToBe",SuposedToBe);
    // console.log("this.CoinConnectedWSStock",this.CoinConnectedWSStock);

    for (let j1 = 0; j1 < SuposedToBe.length; j1++) {
      let flag1 = false;
      for (let j2 = 0; j2 < this.CoinConnectedWSStock.length; j2++) {
        if (this.CoinConnectedWSStock[j2].symbol == SuposedToBe[j1].symbol) {
          flag1 = true;
          break;
        }
      }
      if (!flag1) {
        Toconect.push(SuposedToBe[j1].symbol);
      }
    }

    for (let j1 = 0; j1 < this.CoinConnectedWSStock.length; j1++) {

      let flag2 = false;
      for (let j2 = 0; j2 < SuposedToBe.length; j2++) {
        if (this.CoinConnectedWSStock[j1].symbol == SuposedToBe[j2].symbol) {
          flag2 = true;
        }
      }
      if (!flag2) {
        Todisconect.push(this.CoinConnectedWSStock[j1].symbol);
      }
    }
    // console.log(Toconect);
    // console.log(Todisconect);


    this.addCoinWebsocketStock(Toconect);
    this.leaveCoinWebsocketStock(Todisconect);
    this.CoinConnectedWSStock = SuposedToBe;
  }

  changeModeView(str: string) {
    if (str == this.modeView)
      return;
    this.modeView = str;
    if (this.modeView == "SQUARES") {
      this.stopWS(this.selectedSegment);
    }
    if (this.modeView == "LINES") {
      this.startWS(this.selectedSegment);
      switch (this.selectedSegment) {
        case this.CRYPTO:
          this.CoinConnectedWSCrypto = [];
          this.checkWsCrypto(this.content.scrollTop);
          break;
        case this.FOREX:
          this.CoinConnectedWSForex = [];
          this.checkWsForex(this.content.scrollTop);
          break;
        case this.STOCK:
          this.CoinConnectedWSStock = [];
          this.checkWsStock(this.content.scrollTop);
          break;
        case this.TRENDING:
        // trending
        default:
          // watchlist
          break;
      }
    }
  }


  errorHandler(event) {
    console.debug(event);
    event.target.src = "assets/imgs/stocks.png";
  }


  goToDetails(watchlist: any) {
    let page: string = ""    
    switch (watchlist.type) {
      case this.STOCK:
        page = "item-details-stock";
        break;
      case this.FOREX:
        page = "item-details-forex";
        break;
      case this.CRYPTO:
        page = "item-details-crypto";
        break;

      default:
        break;
    }

    this.navCtrl.push(page, {
      item: watchlist,
    })
  }

  change_sentiment(type: string, i: number, event?:any,that?) {    
    var that2;
    if (event != undefined) {
      event.stopPropagation();
    }
    if (that != undefined) {
      that2 = that;
    }else{
      that2 = this;
    }
    let arr;
    
    switch (that2.selectedSegment) {
      case that2.STOCK:
        arr = that2.stocks;
        break;
      case that2.FOREX:
        arr = that2.forexProvider.forexs;
        break;
      case that2.CRYPTO:
        arr = that2.cryptoProvider.cryptos;
        break;
      case that2.WATCHLIST:
        arr = that2.watchlists;
        if (arr[i].status == "CLOSE" || arr[i].sentiment == "none") {
          for (let index = 0; index < this.stockProvider.allStocks.length; index++) {
            for (let j = 0; j < this.stockProvider.allStocks[index].data.length; j++) {
              if (this.stockProvider.allStocks[index].data[j].symbol == arr[i].symbol) {
                 this.stockProvider.allStocks[index].data[j]["sentiment"] = type;
               this.stockProvider.allStocks[index].data[j]["status"] = "OPEN";
               
              }
            }
           }
        }
        break;

      default:
        break;
    }
  
    if (arr[i].status == "CLOSE" || arr[i].sentiment == "none") {
      arr[i].sentiment = type;
      arr[i].status = "OPEN";
      that2.globalProvider.add_sentiment( arr[i].symbol,type,arr[i].type,arr[i].price)
      .then(()=>{

      })
      .catch((err)=>{
        console.error(err);
      })
    }
    // else if(arr[i].sentiment == type){
    //   arr[i].sentiment = "none";
    //   this.globalProvider.remove_sentiment(arr[i].symbol,type)
    //   .then(()=>{

    //   })
    //   .catch((err)=>{
    //     console.error(err);
    //   })
    // }else if(arr[i].sentiment != type){
    //   let tmp = arr[i].sentiment;
    //   arr[i].sentiment = type;
    //   this.globalProvider.remove_sentiment(arr[i].symbol,tmp)
    //   .then(()=>{
    //     this.globalProvider.add_sentiment( arr[i].symbol,type,arr[i].type,arr[i].price)
    //   .then(()=>{
    //     console.log("change from " + tmp +" to " +arr[i].sentiment);
        
    //   })
    //   .catch((err)=>{
    //     console.error(err);
    //   })

    //   })
    //   .catch((err)=>{
    //     console.error(err);
    //   })
      

    // }
  }

}
