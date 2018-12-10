import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { TrackProvider } from '../../providers/track/track';

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


  constructor( public track:TrackProvider,public navCtrl: NavController) {
    
  }

}
