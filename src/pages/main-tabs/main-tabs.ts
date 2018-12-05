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
  selectedIndex = '0'
  homeRoot = 'HomePage'
  liveFeedRoot = 'live-feed'
  alertsRoot = 'AlertsPage'
  menuRoot = 'menu'
  chatRoot = 'chat-general'


  constructor(public navCtrl: NavController) {
    
  }

}
