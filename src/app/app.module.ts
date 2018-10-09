import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';

import { MyApp } from './app.component';
import { StockProvider } from '../providers/stock/stock';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ForexProvider } from '../providers/forex/forex';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CryptoProvider } from '../providers/crypto/crypto';
import { ChartUI } from '../components/chart-iq/ui_component/ui.component';
import { FCM } from '@ionic-native/fcm';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBvTHEcyqfyj4G7qZU0qVBasRIqYd1K3o4",
  authDomain: "trading-compare-93afb.firebaseapp.com",
  databaseURL: "https://trading-compare-93afb.firebaseio.com",
  projectId: "trading-compare-93afb",
  storageBucket: "trading-compare-93afb.appspot.com",
  messagingSenderId: "212982281977"
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    // ChartUI,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    FCM,
    Keyboard,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    StockProvider,
    ForexProvider,
    CryptoProvider,
    CryptoProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
