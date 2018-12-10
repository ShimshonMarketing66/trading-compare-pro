import { Component, AfterViewInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
import { ViewChild } from '@angular/core'
import { ForexProvider } from '../../../providers/forex/forex';
import { TrackProvider } from '../../../providers/track/track';

@IonicPage({
  name: "search-forex-page"
})

@Component({
  selector: 'page-search-coin-forex',
  templateUrl: 'search-coin-forex.html',
})
export class SearchCoinForex implements AfterViewInit {
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
    public forexProvider: ForexProvider,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {

  }


  onKey(e) {
    if (e.keyCode == 13) {
      let activeElement = <HTMLElement>document.activeElement;
      activeElement && activeElement.blur && activeElement.blur();
      // this.search();
    }
  }

  search() {
    this.array = [];
    if (this.myInput == "")
      return;
    this.array = this.forexProvider.search(this.myInput);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchCoinPage');
  }

  goToDetails(i: number) {
    this.navCtrl.push("item-details-forex", {
      item: this.array[i]
    })
  }

  getImgStock(i:number){
    return this.array[i].logo;
  }

 
}
