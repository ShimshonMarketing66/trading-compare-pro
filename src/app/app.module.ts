import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
// import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { SocialSharing } from '@ionic-native/social-sharing';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AppRate } from '@ionic-native/app-rate';

import { MyApp } from './app.component';
import { StockProvider } from '../providers/stock/stock';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ForexProvider } from '../providers/forex/forex';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CryptoProvider } from '../providers/crypto/crypto';
import { Firebase } from '@ionic-native/firebase';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { AuthDataProvider } from '../providers/auth-data/auth-data';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Sim } from '@ionic-native/sim';
import firebase from 'firebase';
import { GlobalProvider } from '../providers/global/global';
import { StudyDialog } from '../components/chartIQ/study_dialog_component/study.dialog.component';
import { ThemeDialog } from '../components/chartIQ/theme_dialog_component/theme.dialog.component';
import { TimezoneDialog } from '../components/chartIQ/timezone_dialog_component/timezone.dialog.component';
import { OverlayMenu } from '../components/chartIQ/overlay_menu_component/overlay.menu';
import { DrawingToolbar } from '../components/chartIQ/drawing_toolbar_component/drawing.toolbar.component';
import { TitlecasePipe } from '../components/chartIQ/pipes/title.case.pipe';
import { Colorpicker } from '../components/chartIQ/colorpicker_component/colorpicker';
import { MapObjectToArrayPipe } from '../components/chartIQ/pipes/mapObject.pipe';
import { Vibration } from '@ionic-native/vibration';
import { Clipboard } from '@ionic-native/clipboard';
import { Deeplinks } from '@ionic-native/deeplinks';
import { CodePush } from '@ionic-native/code-push';
import { IonicStorageModule  } from '@ionic/storage';
import { TrackProvider } from '../providers/track/track';


const firebaseConfig = {
  apiKey: "AIzaSyBvTHEcyqfyj4G7qZU0qVBasRIqYd1K3o4",
  authDomain: "trading-compare-93afb.firebaseapp.com",
  databaseURL: "https://trading-compare-93afb.firebaseio.com",
  projectId: "trading-compare-93afb",
  storageBucket: "trading-compare-93afb.appspot.com",
  messagingSenderId: "212982281977"
}
firebase.initializeApp(firebaseConfig)
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    MyApp,StudyDialog,ThemeDialog,TimezoneDialog,OverlayMenu,DrawingToolbar,TitlecasePipe,Colorpicker,MapObjectToArrayPipe
    ],
  imports: [
    // ChartUI,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp 
  ],
  providers: [
    SocialSharing,
    Clipboard,
    Vibration,
    GlobalProvider,
    Sim,
    Keyboard,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    StockProvider,
    ForexProvider,
    CryptoProvider,
    InAppPurchase2,
    Facebook,
    GooglePlus,
    AuthDataProvider,
    AndroidPermissions,
    Deeplinks,
    CodePush,
    AdMobPro,
    Firebase,
    TrackProvider,
    AppRate
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
