import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllChatPage } from './all-chat';

@NgModule({
  declarations: [
    AllChatPage,
  ],
  imports: [
    IonicPageModule.forChild(AllChatPage),
  ],
})
export class AllChatPageModule {}
