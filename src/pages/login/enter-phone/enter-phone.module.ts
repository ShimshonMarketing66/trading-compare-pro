import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnterPhonePage } from './enter-phone';

@NgModule({
  declarations: [
    EnterPhonePage,
  ],
  imports: [
    IonicPageModule.forChild(EnterPhonePage),
  ],
})
export class EnterPhonePageModule {}
