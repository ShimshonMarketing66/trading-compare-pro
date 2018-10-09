import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage({
  name:"country-modal"
})
@Component({
  selector: 'page-country-modal',
  templateUrl: 'country-modal.html',
})
export class CountryModalPage {
  contries :string[] = ["united-states-of-america","china","south-korea","netherlands","mexico","australia","saudi-arabia","india","united-kingdom","france","italy","canada","spain","denmark","switzerland","indonesia","argentina","brazil","new-zealand","austria","belgium","russia","israel","finland","turkey","republic-of-poland","estonia"];
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CountryModalPage');
  }

  dismiss(country){
    this.viewCtrl.dismiss(country);
  }

}
