import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatGeneralPage } from './chat-general';

@NgModule({
  declarations: [
    ChatGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatGeneralPage),
  ],
})
export class ChatGeneralPageModule {}
