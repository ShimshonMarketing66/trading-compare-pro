import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Brokers } from './brokers';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    Brokers,
  ],
  imports: [
    IonicPageModule.forChild(Brokers),
    TranslateModule.forChild()
  ],
})
export class AboutUsPageModule {}
