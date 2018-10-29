import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: "enter-phone"
})
@Component({
  selector: 'page-enter-phone',
  templateUrl: 'enter-phone.html',
})
export class EnterPhonePage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad enter-phone');
  }

}
