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
  tabIndex: number = 0;

  homeRoot = 'HomePage'
  liveFeedRoot = 'live-feed'
  alertsRoot = 'AlertsPage'
  menuRoot = 'menu'
  profileRoot = 'my-profile'


  constructor(public navCtrl: NavController) {
    
  }

}
