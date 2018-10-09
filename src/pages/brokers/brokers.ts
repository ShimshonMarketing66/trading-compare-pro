import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage({
  
})
@Component({
  selector: 'page-brokers',
  templateUrl: 'brokers.html',
})
export class BrokersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrokersPage');
  }

}

