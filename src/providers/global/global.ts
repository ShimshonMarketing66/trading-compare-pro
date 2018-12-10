import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StockProvider } from '../stock/stock';
import { CryptoProvider } from '../crypto/crypto';
import { ForexProvider } from '../forex/forex';
import { AuthDataProvider } from '../auth-data/auth-data';
import { ToastController, AlertController, LoadingController, Loading, App } from 'ionic-angular';

@Injectable()
export class GlobalProvider {
  
  private Loading: Loading;
  sentiments = [];
  watchlists = [];
  my_following = [];
  my_followers = [];

  constructor
    (
    public app: App,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public http: HttpClient,
    public cryptoProvider: CryptoProvider,
    public stockProvider: StockProvider,
    public forexProvider: ForexProvider,
    public authData: AuthDataProvider
    ) {

  }

  loading(m_message?: string) {
    let a = "please wait";
    if (m_message != undefined) {
      a = m_message;
    }

    this.Loading = this.loadingCtrl.create({
      duration: 10 * 1000,
      content: a
    })
    this.Loading.present();
  }

  dismiss_loading() {
    let a = "please wait";
    this.Loading.dismiss()
  }



  add_sentiment(symbol: string, type: string, symbol_type: string, price: number): Promise<any> {
    if (!this.isAuth()) {
      this.open_login_alert();
      return;
    }
    return new Promise((resolve, reject) => {
      var dataToSend = {
        _id: this.authData.user._id,
        symbol: symbol,
        symbol_type: symbol_type,
        type: type,
        price: price
      }

      dataToSend["close_date"] = null;
      dataToSend["close_price"] = null;
      dataToSend["status"] = "OPEN"
      dataToSend["user_id"] = this.authData.user._id;
      var d = new Date();
      dataToSend["date"] = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
      this.sentiments.push(dataToSend);

      this.http.post("https://xosignals.herokuapp.com/trading-compare-v2/add-sentiment", dataToSend)
        .toPromise()
        .catch(err => {
          reject(err)
        })
        .then(() => {
          console.log("sentiment added in database succssed .");
          resolve();
        })

    })

  }


  close_sentiment(symbol: string, symbol_type: string, close_price: number): Promise<any> {
    if (!this.isAuth()) {
      this.open_login_alert();
      return;
    }
    return new Promise((resolve, reject) => {
      var dataToSend = {
        _id: this.authData.user._id,
        symbol: symbol,
        symbol_type: symbol_type,
        close_price: close_price
      }
      console.log(symbol, symbol_type);

      switch (symbol_type) {
        case "STOCK":
          for (let index = 0; index < this.stockProvider.allStocks.length; index++) {
            for (let j = 0; j < this.stockProvider.allStocks[index].data.length; j++) {
              if (this.stockProvider.allStocks[index].data[j].symbol == symbol) {
                this.stockProvider.allStocks[index].data[j]["status"] = "CLOSE";
              }
            }
          }
          break;

        case "FOREX":
          for (let index = 0; index < this.forexProvider.allForex.length; index++) {
            if (this.forexProvider.allForex[index].symbol == symbol) {
              this.forexProvider.allForex[index]["status"] = "CLOSE";

            }
          }
          break;

        case "CRYPTO":
          for (let index = 0; index < this.cryptoProvider.arrAllCrypto.length; index++) {
            if (this.cryptoProvider.arrAllCrypto[index].symbol == symbol) {
              this.cryptoProvider.arrAllCrypto[index]["status"] = "CLOSE";
            }
          }
          break;

        default:
          break;
      }
      for (let index = 0; index < this.sentiments.length; index++) {
        if (this.sentiments[index].symbol == symbol && this.sentiments[index].status == "OPEN") {
          this.sentiments[index].status = "CLOSE"
        }

      }
      console.log(dataToSend);


      this.http.post("https://xosignals.herokuapp.com/trading-compare-v2/close-sentiment", dataToSend)
        .toPromise()
        .catch(err => {
          reject(err)
        })
        .then(() => {
          console.log("sentiment removed in database succssed.");
          resolve();
        })

    })

  }

  get_sentiments(_id): Promise<any> {

    return new Promise((resolve, reject) => {
      if (_id == undefined||_id==='') {
        resolve([]);
        return;
      }
      if (this.sentiments.length == 0) {

        this.http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiments-by-user/" + _id).toPromise().then((data: any) => {
          this.sentiments = data;
          resolve(this.sentiments);
        }).catch((err) => {
          reject(err)
        })
      } else {
        resolve(this.sentiments);
      }
    })
  }

  initialProviders(): Promise<any> {
    return new Promise((resolve) => {
      var promises = [this.forexProvider.getAllForex(), this.cryptoProvider.getCrypto(), this.stockProvider.get_stocks(0, "united-states-of-america"), this.get_sentiments(this.authData.user._id),this.authData.getFollowers(this.authData.user._id),this.authData.getFollowing(this.authData.user._id)]
      Promise.all(promises).then((data) => {
          for (let index2 = 0; index2 < data[0].length; index2++) {
            for (let i = 0; i < data[3].length; i++) {
              if (data[0][index2].symbol == data[3][i].symbol && data[3][i].status == "OPEN") {
                data[0][index2]["sentiment"] = data[3][i].type;
                data[0][index2]["status"] = "OPEN";
                break;
              }
            }
          }

          for (let index2 = 0; index2 < data[1].length; index2++) {
            for (let i = 0; i < data[3].length; i++) {
              if (data[1][index2].symbol == data[3][i].symbol && data[3][i].status == "OPEN") {
                data[1][index2]["sentiment"] = data[3][i].type;
                data[1][index2]["status"] = "OPEN";
                break;
              }
            }
          }

          for (let index2 = 0; index2 < data[2].length; index2++) {
            for (let i = 0; i < data[3].length; i++) {
              if (data[2][index2].symbol == data[3][i].symbol && data[3][i].status == "OPEN") {
                data[2][index2]["sentiment"] = data[3][i].type;
                data[2][index2]["status"] = "OPEN";
                break;
              }
            }
          }
        
          this.my_following = data[5];
          this.my_followers = data[4];

        let promises11 = [this.forexProvider.getAllForex(), this.cryptoProvider.getCrypto()];
        for (let index = 0; index < this.authData.user.watchlist.length; index++) {
          if (this.authData.user.watchlist[index].type == "STOCK") {
            promises11.push(this.stockProvider.get_stock_by_symbol(this.authData.user.watchlist[index].symbol));
          }
        }

        Promise.all(promises11).then((data: any[]) => {
          for (let i = 0; i < this.authData.user.watchlist.length; i++) {
            switch (this.authData.user.watchlist[i].type) {
              case "FOREX":
                for (let j = 0; j < data[0].length; j++) {
                  if (data[0][j].symbol == this.authData.user.watchlist[i].symbol) {
                    this.watchlists.push(data[0][j]);
                    break;
                  }
                }
                break;
              case "CRYPTO":
                for (let j = 0; j < data[1].length; j++) {
                  if (data[1][j].symbol == this.authData.user.watchlist[i].symbol) {
                    this.watchlists.push(data[1][j]);
                    break;
                  }
                }
                break;
              case "STOCK":
                for (let j = 2; j < data.length; j++) {
                  if (data[j].symbol == this.authData.user.watchlist[i].symbol) {
                    for (let aaa = 0; aaa < this.sentiments.length; aaa++) {
                      if (this.sentiments[aaa].symbol == data[j].symbol) {
                        if (this.sentiments[aaa].status == "OPEN") {
                          data[j]["status"] = "OPEN";
                          data[j]["sentiment"] = this.sentiments[aaa].type;
                          break;
                        } else {
                          data[j]["status"] = "CLOSE";
                          data[j]["sentiment"] = this.sentiments[aaa].type;
                        }
                      }
                    }
                    this.watchlists.push(data[j]);
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
    })
  }

  get_sentiments_users(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiments-leaderboard")
        .toPromise()
        .then((data:any[]) => {
          for (let index = 0; index < data.length; index++) {
            data[index].country = data[index].country.replace(" ","-");
          }
          resolve(data);
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get_comments(symbol: string): Promise<any> {
    return this.http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-comments/" + symbol).toPromise()
  }


  add_to_watchlist(event: any, item) {
  

    if (event != undefined) {
      event.stopPropagation();
    }

    if (!this.isAuth()) {
      this.open_login_alert();
      return;
    }

    if (this.authData.user.watchlist.length + 1 > 10 && this.authData.user.state == "unknown") {

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
              let nav = this.app.getActiveNav();
              nav.setRoot("login-tabs")

            }
          }
        ]
      })
      alert.present();
      return;
    }

    if (this.watchlists.length != 0) {
      this.watchlists.push(item);
    }
    item.is_in_watchlist = true;

    let toast = this.toastCtrl.create({
      message: item.symbol + ' was added successfully',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
    this.add_to_watchlist_backend(item.symbol, item.type);
  }

  add_to_watchlist_backend(symbol: string, type: string) {

    if (!this.isAuth()) {
      this.open_login_alert();
      return;
    }

    let dataTOSEND = {
      data: {
        symbol: symbol,
        type: type
      },
      _id: this.authData.user._id
    }
    this.http.post("https://xosignals.herokuapp.com/trading-compare-v2/add-to-watchlist", dataTOSEND)
      .toPromise()
      .then(data => {
        console.log(symbol + " added");
        this.authData.user.watchlist.push(dataTOSEND.data);
      })
      .catch(err => {
        console.log("err", err);
      })
  }


  remove_from_watchlist(event: any, item: any) {
    if (event != undefined) {
      event.stopPropagation();
    }

    if (!this.isAuth()) {
      this.open_login_alert();
      return;
    }

    item.is_in_watchlist = false;

    for (let index = 0; index < this.watchlists.length; index++) {
      if (this.watchlists[index].symbol == item.symbol) {
        this.watchlists.splice(index, 1);
      }
    }

    let toast = this.toastCtrl.create({
      message: item.symbol + ' was removed from watchlist successfully',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();


    for (let index = 0; index < this.authData.user.watchlist.length; index++) {
      if (this.authData.user.watchlist[index].symbol == item.symbol) {
        this.authData.user.watchlist.splice(index, 1);
        break;
      }
    }

    this.remove_from_watchlist_backend(item.symbol, item.type);
  }


  remove_from_watchlist_backend(symbol: string, type: string) {
    if (!this.isAuth()) {
      this.open_login_alert();
      return;
    }
    let dataTOSEND = {
      data: {
        symbol: symbol,
        type: type
      },
      _id: this.authData.user._id
    }
    this.http.post("https://xosignals.herokuapp.com/trading-compare-v2/remove-from-watchlist", dataTOSEND)
      .toPromise()
      .then(data => {

      })
      .catch(err => {
        console.log("err", err);
      })
  }

  isAuth():boolean{
    
    return this.authData.isFinishRegistration;
  }
  
  open_login_alert(){
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to buy this book?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.app
          }
        },
        {
          text: 'Buy',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  get_all_information(_id): Promise<any> {
    
    return new Promise((resolve, reject) => {
      var promises = [];
      promises.push(this.authData.getProfileFromServer(_id));
      promises.push(this.authData.getFollowing(_id));
      promises.push(this.authData.getFollowers(_id));
      promises.push(this.authData.getPost(_id));

      Promise.all(promises).then((data) => {
        console.log(data);

        this.get_watchlist(data[0].watchlist).then((WATCH) => {
          var a = data[0];
          a["following"] = data[1];
          a["followers"] = data[2];
          a["posts"] = data[3];
          a["watchlist"] = WATCH;
          resolve(a);
        })

      })
    })
  }

  get_watchlist(watchlist_to_return): Promise<any> {
    return new Promise((resolve) => {
      var promises = [];

      for (let index = 0; index < watchlist_to_return.length; index++) {
        switch (watchlist_to_return[index].type) {
          case "STOCK":
            promises.push(this.stockProvider.get_stock_by_symbol(watchlist_to_return[index].symbol))
            break;

          case "FOREX":
            promises.push(this.forexProvider.get_by_symbol(watchlist_to_return[index].symbol))

            break;

          case "CRYPTO":
            promises.push(this.cryptoProvider.get_by_symbol(watchlist_to_return[index].symbol))
            break;

          default:
            break;
        }
      }

      Promise.all(promises).then((data) => {
        for (let index = 0; index < data.length; index++) {
          let flag = false;
          for (let j = 0; j < this.watchlists.length; j++) {
            if (this.watchlists[j].symbol == data[index].symbol) {
              data[index]["is_in_watchlist"] = true;
              break;
            }
            data[index]["is_in_watchlist"] = flag;
          }

        }

        resolve(data);

      })

    })
  }
  get_symbol_type(symbol: string): any {
  for (let index = 0; index < this.forexProvider.forexs.length; index++) {
    if (this.forexProvider.forexs[index].symbol == symbol) {
      return "FOREX";
    }
  }
  for (let index = 0; index < this.cryptoProvider.cryptos.length; index++) {
    if (this.cryptoProvider.cryptos[index].symbol == symbol) {
      return "CRYPTO";
    }
  }

  return "STOCK";
  }

}
