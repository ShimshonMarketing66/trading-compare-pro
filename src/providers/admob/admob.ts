import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { GlobalProvider } from '../global/global';

@Injectable()
export class AdmobProvider {


  constructor(public admobFree: AdMobFree,public global:GlobalProvider) {

    var admobid = {
      banner: 'ca-app-pub-7144298839495795/2206101991',
      interstitial: 'ca-app-pub-7144298839495795/4257550264'
    };
    const bannerConfig: AdMobFreeBannerConfig = {
      isTesting: true,
      autoShow: false,
      id:admobid.banner
    };

    const interstitialConfig: AdMobFreeInterstitialConfig = {
      isTesting: true,
      autoShow: false,
      id:admobid.interstitial
    };

    if (global.authData.platform == "browser") {
      return;
    }
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.interstitial.config(interstitialConfig);

    this.admobFree.banner.prepare();
    this.admobFree.interstitial.prepare();

    this.handle_events()

  }

  showBanner(){
    if (this.global.authData.platform == "browser") {
      return;
    }
    this.admobFree.banner.show();
  }

  hideBanner(){
    if (this.global.authData.platform == "browser") {
      return;
    }
    this.admobFree.banner.hide();
  }

  showInterstitial(): any {
    if (this.global.authData.platform == "browser") {
      return;
    }
    this.admobFree.interstitial.show();
  }


  handle_events(){
    this.admobFree.on(this.admobFree.events.BANNER_LOAD_FAIL).subscribe((err)=>{
      console.log("BANNER_LOAD_FAIL",err);
    })

    this.admobFree.on(this.admobFree.events.INTERSTITIAL_LOAD_FAIL).subscribe((err)=>{
      console.log("INTERSTITIAL_LOAD_FAIL",err);
    })

    this.admobFree.on(this.admobFree.events.BANNER_LOAD).subscribe((data)=>{
      console.log("BANNER_LOAD",data);
    })

    this.admobFree.on(this.admobFree.events.INTERSTITIAL_LOAD).subscribe((data)=>{
      console.log("INTERSTITIAL_LOAD",data);
    })

  }
}
