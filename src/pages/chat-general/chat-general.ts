import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name:"chat-general"
})
@Component({
  selector: 'page-chat-general',
  templateUrl: 'chat-general.html',
})
export class ChatGeneralPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatGeneralPage');
  }

}
