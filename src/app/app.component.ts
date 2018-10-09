import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = "login-tabs";

  constructor(private fcm: FCM,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      if (platform.is("cordova")) {
        statusBar.styleDefault();
        splashScreen.hide();

        this.fcm.getToken().then(token => {
          console.log("getToken", token);
          
        });
        
        this.fcm.subscribeToTopic("first_topic").then(() => {
          console.log("first_topic");
          
        });
  
        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          
          if(data.wasTapped){
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
          };
        });
        
        this.fcm.onTokenRefresh().subscribe(token => {
          console.log("onTokenRefresh", token);
          
        });
        
        this.fcm.unsubscribeFromTopic('marketing');
        
      }


      
    });
  }
}

