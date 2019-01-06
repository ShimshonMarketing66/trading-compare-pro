import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { AuthDataProvider } from '../auth-data/auth-data';
import { Appsflyer, AppsflyerOptions, AppsflyerEvent } from '@ionic-native/appsflyer';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Platform } from 'ionic-angular';

@Injectable()
export class TrackProvider {
  appsflyerOptions:AppsflyerOptions;
  constructor(public platform:Platform,  private ga: GoogleAnalytics,
    private appsflyer: Appsflyer,public firebase:Firebase,public authData:AuthDataProvider) {
      this.platform.ready().then(()=>{
        this.ga.startTrackerWithId('UA-119764512-1')
        .then(() => {
          console.log('Google analytics is ready now');
           this.ga.trackView('open_app');
          // Tracker is ready
          // You can now track pages or set additional information such as AppVersion or UserId
        })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
      })
      
    // this.ga.debugMode().then((data)=>{
    // console.log("debugMode data",data);

    // }).catch((err)=>{
    //   console.log("debugMode err",err);
    // })
  }

  setUserId(_id){
    if (this.authData.platform == "browser") {
      return;
    }
   
    this.firebase.setUserId(_id);
    this.ga.setUserId(_id).then((data)=>{
      console.log("this.ga.setUserId",data);
      
    }).catch((err)=>{
      console.log("this.ga.setUserId err",err);
    })
    
    this.appsflyer.setAppUserId(_id);
  }

  log_event(type:string,m_params:{
    screen:string,
    broker?:string,
    symbol?:string,
    nickname?:string,
    nickname_to_visit?:string,
    comment_id?:string,
    new_title?:string,
    type_sentiment?:string,
    price?:number,
    close_price?:string
  }){
    var params={};
    for (const key in m_params) {
      if (m_params[key] !== '') {
        params[key]=m_params[key]
      }
    }
    // console.log(params);
    
     if (this.authData.platform == "browser") {
      return;
    }
    this.firebase.logEvent(type,params).then((data)=>{
      console.log("succses log event",data);
    }).catch((err)=>{
      console.log("error log event",err);
    })

    this.ga.trackEvent(type,"click",m_params.screen,0,false)
    this.appsflyer.trackEvent(type,params)
  }

  log_screen(screen:string){
    this.firebase.setScreenName(screen);
    this.ga.trackView(screen);
  }

}
