import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { AuthDataProvider } from '../auth-data/auth-data';

@Injectable()
export class TrackProvider {
  
  constructor(public firebase:Firebase,public authData:AuthDataProvider) {
  
  }

  setUserId(_id){
    if (this.authData.platform == "browser") {
      return;
    }
    this.firebase.setUserId(_id);
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
    console.log(params);
    
     if (this.authData.platform == "browser") {
      return;
    }
    this.firebase.logEvent(type,{params:params}).then((data)=>{
      console.log("succses log event",data);
    }).catch((err)=>{
      console.log("error log event",err);
    })
  }

  log_screen(screen:string){
    this.firebase.setScreenName(screen);
  }

}
