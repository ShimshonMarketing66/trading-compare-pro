import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SentimentsPage } from './sentiments';

@NgModule({
  declarations: [
    SentimentsPage,
  ],
  imports: [
    IonicPageModule.forChild(SentimentsPage),
  ],
})
export class SentimentsPageModule {}
