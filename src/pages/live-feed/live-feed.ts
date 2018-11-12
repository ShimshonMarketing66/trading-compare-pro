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
  @ViewChild('containerSegment') containerSegment: ElementRef;
  @ViewChild('content') content: Content;
  modeView: string = "LINES"

  watchlists = [];
  /* CRYPTO */
  CoinConnectedWSCrypto: any[] = [];
  ScrollFromTopCrypto: number = 0;
  ScrollDoneCrypto: boolean = true;
  cryptos: any = [];
  socketCrypto: SocketIOClient.Socket;
  /* END CRYPTO */

  /* FOREX */
  CoinConnectedWSForex: any[] = [];
  ScrollFromTopForex: number = 0;
  forexs: any = [];
  socketForex: SocketIOClient.Socket;
  /* END FOREX */

  /* STOCK */
  CoinConnectedWSStock: any[] = [];
  ScrollFromTopStock: number = 0;
  socketStock: SocketIOClient.Socket;
  /* END STOCK */


  /* DEFINITIONS ALL ARRAYS */
  offsetRequested:number=0;
  stocks: IStock[] = [];
  stockOffset: number = 0;
  exchangeStock: string = "united-states-of-america";
  /*  END DEFINITIONS ALL ARRAYS */

  slides: string[];

  public selectedSegment: string =  this.STOCK;
  public Segments: Array<string> = [ this.STOCK, this.FOREX, this.CRYPTO,this.WATCHLIST,this.TRENDING];
  
  
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

    this.slides = [this.STOCK, this.FOREX, this.CRYPTO, this.WATCHLIST, this.TRENDING];
    this.buildStocks(0).then(()=>{
      this.offsetRequested = 50; 
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
    this.content.scrollToTop(0);
    this.offsetRequested = 0;
    if (this.selectedSegment == segment) return;

    this.stopWS(this.selectedSegment);
    switch (this.selectedSegment) {
      case this.STOCK:
        this.stocks = [];
        break;
      case this.FOREX:
        this.forexs = [];
      case this.CRYPTO:
        this.cryptos = [];
      case this.WATCHLIST:
        break;
      case this.TRENDING:
        break;
      default:
        break;
    }

    switch (segment) {
      case this.STOCK:
        this.selectedSegment = this.STOCK;
        this.buildStocks(0).then(() => {
          this.offsetRequested+=50;
          if (this.modeView == "SQUARES") {
           
          }
        });
        break;
      case this.FOREX:
        this.selectedSegment = this.FOREX;
        this.buildForex().then(() => {
          if (this.modeView == "SQUARES") {
           
          }
        })
        break;
      case this.CRYPTO:
        this.selectedSegment = this.CRYPTO;
        this.buildCrypto().then(() => {
          if (this.modeView == "SQUARES") {
            
          }
        })
        break;
      case this.WATCHLIST:
        this.selectedSegment = this.WATCHLIST;
        if (this.watchlists.length == 0) {
          this.buildWatchlist();
        }
        break;
      case this.TRENDING:
        this.selectedSegment = this.TRENDING;
        break;
      default:
        break;
    }
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
        this.stocks = data;
        this.stockOffset = data.length;
        this.offsetRequested = 50;
      })
    })
  }

  doInfinite() {
    console.log("do infinit",this.selectedSegment);
    return new Promise((resolve)=>{
    switch (this.selectedSegment) {
      case this.STOCK:
        this.stockProvider.get_stocks(this.offsetRequested,this.exchangeStock)
        .then(data=>{          
          this.offsetRequested += data.length;
          for (let index = 0; index < data.length; index++) {
           this.stocks.push(data[index]);
          }
         resolve();
        })
        .catch(err=>{
          console.error(err);
          resolve();
        })
        break;
        case this.FOREX:
        this.forexProvider.getForex(this.offsetRequested)
        .then(data=>{       
          this.offsetRequested += data.length;
          for (let index = 0; index < data.length; index++) {
           this.forexs.push(data[index]);
          }
         resolve();
        })
        .catch(err=>{
          console.error(err);
          resolve();
        })
        break;
        case this.CRYPTO:
        this.cryptoProvider.getCrypto(this.offsetRequested)
        .then(data=>{       
          this.offsetRequested += data.length;
          for (let index = 0; index < data.length; index++) {
           this.cryptos.push(data[index]);
          }
         resolve();
        })
        .catch(err=>{
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
      item: this.stocks[i]
    })
  }

  goToDetailsForex(i: number) {
    this.navCtrl.push("item-details-forex", {
      item: this.forexs[i]
    })
  }

  goToDetailsCrypto(i: number) {
    this.navCtrl.push("item-details-crypto", {
      item: this.cryptos[i]
    })
  }
  
  buildWatchlist(): Promise<any> {
    return new Promise((resolve) => {
      let promises = [this.forexProvider.getAllForex(),this.cryptoProvider.getCrypto()];
      for (let index = 0; index < this.authData.user.watchlist.length; index++) {
        if(this.authData.user.watchlist[index].type == this.STOCK){
          promises.push(this.stockProvider.get_stock_by_symbol(this.authData.user.watchlist[index].symbol));
        }
      }
      Promise.all(promises).then((data:any[])=>{
        for (let i = 0; i < this.authData.user.watchlist.length; i++) {
          switch (this.authData.user.watchlist[i].type) {
            case this.FOREX:
              for (let j = 0; j < data[0].length; j++) {
               if (data[0][j].symbol == this.authData.user.watchlist[i].symbol ) {
                 this.watchlists.push(data[0][j]);
                 break;
               }
              }
              break;
              case this.CRYPTO:
              for (let j = 0; j < data[1].length; j++) {
                if (data[1][j].symbol == this.authData.user.watchlist[i].symbol ) {
                  this.watchlists.push(data[1][j]);
                  break;
                }
               }
              break;
              case this.STOCK:
              for (let j = 2; j < data.length; j++) {
                if (data[j].symbol == this.authData.user.watchlist[i].symbol ) {
                  this.watchlists.push(data[j]);
                  break;
                }
               }
              break;
          
            default:
              break;
          }
        }
        console.log(this.watchlists);
        
      })
    })
  }

  buildForex(): Promise<any> {
    return new Promise((resolve) => {
      this.forexProvider.getForex(0).then(data => {
        for (let index = 0; index < data.length; index++) {
          this.forexs.push(data[index]);
        }
        let arr = [];
        for (let index = 0; index < this.forexs.length; index++) {
          if (index < this.numOfLines) {
            this.CoinConnectedWSForex.push(data[index]);
            arr.push(data[index].pair);
          }
        }
        if (this.modeView == "LINES") {
          this.startWS(this.FOREX);
          this.addCoinWebsocketForex(arr);
        }
        resolve();
      })
    })
  }

  buildCrypto(): Promise<any> {
    return new Promise((resolve) => {
      this.cryptoProvider.getCrypto(0).then(data => {
        for (let index = 0; index < data.length; index++) {
          this.cryptos.push(data[index])
        }
        let arr = [];
        for (let index = 0; index < this.cryptos.length; index++) {
          if (index < this.numOfLines) {
            this.CoinConnectedWSCrypto.push(data[index]);
            arr.push(data[index].pair);
          }
        }
        if (this.modeView == "LINES") {
          this.startWS(this.CRYPTO);
          this.addCoinWebsocketCrypto(arr);
        }
        resolve()
      })
    })
  }

  buildStocks(stockOffset?: number): Promise<any> {
    return new Promise((resolve) => {
      this.stockProvider.get_stocks(stockOffset, this.exchangeStock).then(async (data) => {
        for (let index = 0; index < data.length; index++) {
          this.stocks.push(data[index]);
        }
        this.offsetRequested = this.stocks.length;
        let arr = [];
        for (let index = 0; index < this.stocks.length; index++) {
          this.stocks[index]["index"] = index;
          if (index < this.numOfLines) {
            this.CoinConnectedWSStock.push(data[index]);
            arr.push(data[index].symbol);
          }
        }
        await this.startWS(this.STOCK);
        this.addCoinWebsocketStock(arr);
        resolve();
      })
    })
  }
foo(){
  
  console.log(this.CoinConnectedWSStock);
  
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
          for (let index = 0; index < this.CoinConnectedWSCrypto.length; index++) {
            let a = this.cryptos[index]["index"];
            if (pair == this.CoinConnectedWSCrypto[index].pair) {
              if (this.cryptos[a].price > Number(data.price)) {
                this.cryptos[a].state = this.cryptos[a].state == "falling" ? "falling1" : "falling";
                this.cryptos[a].price = Number(data.price);
                this.cryptos[a].high24 = Number(data.high24);
                this.cryptos[a].low24 = Number(data.low24);
                this.cryptos[a].change24 = Number(data.change24);
              } else if (this.cryptos[a].price < Number(data.price)) {
                this.cryptos[a].state = this.cryptos[a].state == "raising" ? "raising1" : "raising";
                this.cryptos[a].price = Number(data.price);
                this.cryptos[a].high24 = Number(data.high24);
                this.cryptos[a].low24 = Number(data.low24);
                this.cryptos[a].change24 = Number(data.change24);
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
        console.log(this.socketForex);
        this.socketForex.on("message", (data) => {
          if (this.socketForex.disconnected) {
            return;
          }
          let pair = data.pair;
          for (let index = 0; index < this.CoinConnectedWSForex.length; index++) {
            if (pair == this.CoinConnectedWSForex[index].pair) {
              let a = this.CoinConnectedWSForex[index].index;
              if (this.forexs[a].price > data.price) {
                this.forexs[a].state = this.forexs[a].state == "falling" ? "falling1" : "falling";
                this.forexs[a].price = Number(data.price);
                this.forexs[a].high24 = Number(data.high24);
                this.forexs[a].low24 = Number(data.low24);
                this.forexs[a].change24 = Number(data.change24);
              } else if (this.forexs[a].price < data.price) {
                this.forexs[a].state = this.forexs[a].state == "raising" ? "raising1" : "raising";
                this.forexs[a].price = Number(data.price);
                this.forexs[a].high24 = Number(data.high24);
                this.forexs[a].low24 = Number(data.low24);
                this.forexs[a].change24 = Number(data.change24);
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
              if (Number(this.stocks[a].price) > data.price) {
                this.stocks[a]["state"] = this.stocks[a]["state"] == "falling" ? "falling1" : "falling";
              } else if (Number(this.stocks[a].price) < data.price) {
                this.stocks[a]["state"] = this.stocks[a]["state"] == "raising" ? "raising1" : "raising";
              }

              if (Number(data.price) > Number(this.stocks[a].day_high)) {
                this.stocks[a].day_high = data.price;
              }

              if (Number(data.price) < Number(this.stocks[a].day_low)) {
                this.stocks[a].day_low = data.price;
              }

              let original = Number(this.stocks[a].price_open);
              let neww = Number(data.price);

              this.stocks[a].change_pct = (((neww - original) / original) * 100).toString()
              this.stocks[a].price = (Number(data.price)).toString();
              break;
            }
          }
        })
        break;
      case this.TRENDING:
      // trending
      default:
        // watchlist
        break;
    }
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
      if (a + j > -1 && this.cryptos[a + j] != undefined) {
        SuposedToBe.push(this.cryptos[a + j]);
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
      if (a + j > -1 && this.forexs[a + j] != undefined) {
        SuposedToBe.push(this.forexs[a + j]);
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
      if (a + j > -1 && this.stocks[a + j] != undefined) {
        SuposedToBe.push(this.stocks[a + j]);
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

  add_to_watchlist(event: any, symbol: string, type: string, i) {
    event.stopPropagation();
    if (this.authData.user.watchlist.length+1>10 && this.authData.user.state == "unknown") {
      let alert = this.alertCtrl.create({
        title: 'your watchlist is full',
        subTitle: 'you have to be vip to make your watchlist greaten.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Go to vip',
            handler: () => {
              console.log('go to vip.');
            }
          }
        ]
      })
      alert.present();
      return;
    }
    switch (type) {
      case this.STOCK:
        this.stocks[i].is_in_watchlist = true;
        this.watchlists.push(this.stocks[i]);
        break;
      case this.FOREX:
        this.forexs[i].is_in_watchlist = true;
        this.watchlists.push(this.forexs[i]);
        break;
      case this.CRYPTO:
        this.cryptos[i].is_in_watchlist = true;
        this.watchlists.push(this.cryptos[i]);
        break;
      default:
        console.log("missing params");
        return;
    }
 
    let toast = this.toastCtrl.create({
      message: symbol + ' was added successfully',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
    this.globalProvider.add_to_watchlist(symbol, type)
  }

  errorHandler(event) {
    console.debug(event);
    event.target.src = "assets/imgs/flags/flag general.png";
  }

  remove_from_watchlist(event: any, symbol: string, type: string, i) {
    event.stopPropagation();
    switch (type) {
      case this.STOCK:
        this.stocks[i].is_in_watchlist = false;
        break;
      case this.FOREX:
        this.forexs[i].is_in_watchlist = false;
        break;
      case this.CRYPTO:
        this.cryptos[i].is_in_watchlist = false;
        break;
      default:
        console.log("missing params");
        return;
    }
    for (let index = 0; index < this.watchlists.length; index++) {
      if ( this.watchlists[index].symbol == symbol) {
        this.watchlists.splice(index, 1);
      }
    }
    let toast = this.toastCtrl.create({
      message: symbol + ' was removed from watchlist successfully',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
    this.globalProvider.remove_from_watchlist(symbol, type)
  }



}
