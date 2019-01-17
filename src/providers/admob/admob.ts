import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { GlobalProvider } from '../global/global';
import { Platform } from 'ionic-angular';

@Injectable()
export class AdmobProvider {

  canshow=false;

  constructor(
    public admobFree: AdMobFree,
    public global:GlobalProvider,
    public platform :Platform
    ) {
    platform.ready().then(()=>{
      var admobid = {
        banner: 'ca-app-pub-7144298839495795/1547247166',
        interstitial: 'ca-app-pub-7144298839495795/2477185450'
      };
      const bannerConfig: AdMobFreeBannerConfig = {
        isTesting: false,
        autoShow: false,
        id:admobid.banner
      };
  
      const interstitialConfig: AdMobFreeInterstitialConfig = {
        isTesting: false,
        autoShow: true,
        id:admobid.interstitial
      };
  
      if (global.authData.platform == "browser") {
        return;
      }
      this.admobFree.banner.config(bannerConfig);
      this.admobFree.interstitial.config(interstitialConfig);
  
      this.admobFree.banner.prepare().then((sa)=>{
        console.log("banner sa admob ",sa);
        this.canshow = true;
      }).catch((err)=>{
        console.log("banner err admob ",err);
        
      });

      setTimeout(()=>{
        this.admobFree.interstitial.prepare().then((sa)=>{
          this.canshow = true;
          console.log("interstitial admob ",sa);
        }).catch((err)=>{
          console.log("interstitial err admob ",err);
        });
      },3000)
 
      this.handle_events()
    })
    

  }

  showBanner(){
    if (this.global.authData.platform == "browser" ||  !this.canshow) {
      return;
    }
    this.admobFree.banner.show();
  }

  hideBanner(){
    if (this.global.authData.platform == "browser" || !this.canshow ) {
      return;
    }
    this.admobFree.banner.hide();
  }

  showInterstitial(): any {
    if (this.global.authData.platform == "browser"|| !this.canshow) {
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
