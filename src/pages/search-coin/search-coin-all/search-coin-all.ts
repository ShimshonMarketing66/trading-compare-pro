import { Component, AfterViewInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
import { ViewChild } from '@angular/core'
import { CryptoProvider } from '../../../providers/crypto/crypto';

@IonicPage({
  name: "search-all-page"
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
      // this.search();
    }
  }

  search() {
    clearTimeout(this.timout);
    if (this.myInput == ""){
      this.array = [];
      return;
    }  
    this.timout = setTimeout(() => {
      this.array = this.cryptoProvider.search(this.myInput);
    }, 1000)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchCoinPage');
  }

  goToDetails(i: number) {
    this.navCtrl.push("item-details-crypto", {
      item: this.array[i]
    })
  }



}
