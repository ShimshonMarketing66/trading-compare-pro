import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { AuthDataProvider } from '../auth-data/auth-data';

@Injectable()
export class TrackProvider {
  
  constructor(public firebase:Firebase,public authData:AuthDataProvider) {
  
  }

  setUserId(_id){
    this.firebase.setUserId(this.authData.user._id);
  }

  log_event(type:string,params:any){
    
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
