import { Component, AfterContentInit, AfterViewInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Keyboard, Searchbar } from 'ionic-angular';
import { ViewChild } from '@angular/core'
import { StockProvider } from '../../../providers/stock/stock';
import { RmPointPipe } from '../../../pipes/rm-point/rm-point';
import { TrackProvider } from '../../../providers/track/track';

@IonicPage({
  name: "search-stock-page"
})

@Component({
  selector: 'page-search-coin-stock',
  templateUrl: 'search-coin-stock.html',
})
export class SearchCoinStock implements AfterViewInit {
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
  myInput: string = ""
  constructor( public track:TrackProvider,
    public zone: NgZone,
    public stockProvider: StockProvider,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {
      this.track.log_screen("search-coin-stock");
  }


  onKey(e) {
    if (e.keyCode == 13) {
      let activeElement = <HTMLElement>document.activeElement;
      activeElement && activeElement.blur && activeElement.blur();
      this.search();
    }
  }
  search() {

    let aa = new RmPointPipe()

    this.array = [];
    if (this.myInput == "")
      return;
    this.stockProvider.searchStock(this.myInput).then((arr :any)=> {


      this.array = arr;

    
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchCoinPage');
  }

  updateUrl(i) {
    this.array[i]["logo"] = "assets/imgs/flags/flag general.png"

  }

  goToDetails(i: number) {
    this.navCtrl.push("item-details-stock", {
      item: this.array[i]
    })
  }

  getImgStock(i:number){
    console.log(this.array[i].logo);
    return this.array[i].logo;
  }

  errorHandler(event) {
    console.debug(event);
    event.target.src = "assets/imgs/flags/flag general.png";
 }

}
