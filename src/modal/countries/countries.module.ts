import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Countries } from './countries';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    Countries,
  ],
  imports: [
    IonicPageModule.forChild(Countries),
    TranslateModule.forChild()
  ],
})
export class AboutUsPageModule {}
