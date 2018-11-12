import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-swipe',
  templateUrl: 'swipe.html',
})
export class SwipePage {
  public category: string = 'movies';
  public categories: Array<string> = ['movies', 'tvshows', 'animated']
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SwipePage');
  }
  
  onTabChanged(tabName) {
    console.log(tabName);
    
    this.category = tabName;
  }

}
