import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  name:"main-tabs"
})
@Component({
  selector: 'page-main-tabs',
  templateUrl: 'main-tabs.html'
})
export class MainTabsPage {

  homeRoot = 'HomePage'
  liveFeedRoot = 'live-feed'
  alertsRoot = 'AlertsPage'
  brokersRoot = 'BrokersPage'
  profileRoot = 'ProfilePage'


  constructor(public navCtrl: NavController) {}

}
