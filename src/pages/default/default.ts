import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name:"default-page"
})
@Component({
  selector: 'page-default',
  templateUrl: 'default.html',
})
export class DefaultPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.navCtrl.setRoot("main-tabs");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DefaultPage');
  }

}
