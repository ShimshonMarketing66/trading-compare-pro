import { Component, AfterViewInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
import { ViewChild } from '@angular/core'
import { CryptoProvider } from '../../../providers/crypto/crypto';
import { TrackProvider } from '../../../providers/track/track';
import { ForexProvider } from '../../../providers/forex/forex';
import { StockProvider } from '../../../providers/stock/stock';

@IonicPage({
  name: "search-all"
})

@Component({
  selector: 'page-search-coin-all',
  templateUrl: 'search-coin-all.html',
})
export class SearchCoinAll implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 1000);

  }
  ngAfterContentInit(): void {
    // this.searchbar.setFocus();
  }
  @ViewChild('searchbar') searchbar: Searchbar;
  array: any[] = [];
  canSearch = true;
  myInput: string = "";
  timout:any;
  constructor( 
    public stockProvider:StockProvider,
    public forexProvider:ForexProvider,
    public track:TrackProvider,
    public zone: NgZone,
    public cryptoProvider: CryptoProvider,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {

  }


  onKey(e) {
    if (e.keyCode == 13) {
      let activeElement = <HTMLElement>document.activeElement;
      activeElement && activeElement.blur && activeElement.blur();
      this.search();
    }
  }
  foo(){
    console.log(this.array);
    
  }
  search() {
    clearTimeout(this.timout);
    if (this.myInput == ""){
      this.array = [];
      return;
    }  
    this.timout = setTimeout(() => {
      this.array = this.cryptoProvider.search(this.myInput);
      for (let index = 0; index < this.array.length; index++) {
        this.array[index]["type"] = "CRYPTO";
      }
      let aaa = this.forexProvider.search(this.myInput);
       for (let index = 0; index < aaa.length; index++) {
        aaa[index]["type"] = "FOREX";
        this.array.push(aaa[index]);
        }
        this.stockProvider.searchStock(this.myInput).then((arr :any)=> {
          for (let index = 0; index < arr.length; index++) {
            arr[index]["type"] = "STOCK";
            this.array.push(arr[index]);
            }
        })
    }, 1000)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchCoinPage');
  }

  goToDetails(i: number) {
    let page;
    switch (this.array[i].type) {
      case "STOCK":
      page = "item-details-stock";
        break;
        case "FOREX":
        page = "item-details-forex";
        break;
        case "CRYPTO":
        page = "item-details-crypto";
        break;
    
      default:
        break;
    }
    this.navCtrl.push(page, {
      symbol: this.array[i].symbol
    })
  }

  errorHandler(event) {
    event.target.src = "assets/imgs/flags/flag general.png";
 }


}
