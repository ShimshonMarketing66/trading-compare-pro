import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { TrackProvider } from '../../providers/track/track';
import { Deeplinks } from '@ionic-native/deeplinks';

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


  constructor(public deeplinks:Deeplinks, public track:TrackProvider,public navCtrl: NavController,public plt:Platform) {
    if(plt.is("cordova")){
      this.deeplinks.routeWithNavController(this.navCtrl, {
        '/all/:primary_key': "all-chat",
        '/stock/:symbol': "item-details-stock",
        '/forex/:symbol': "item-details-forex",
        '/crypto/:symbol': "item-details-crypto",
        '/stock/:symbol/:primary_key': "item-details-stock",
        '/forex/:symbol/:primary_key': "item-details-forex",
        '/crypto/:symbol/:primary_key': "item-details-crypto"
      }).subscribe(match => {
        console.log('Successfully matched route', match);
        return;
      }, nomatch => {
        console.error('Got a deeplink that didn\'t match', nomatch);
      });
    }

  }

}
