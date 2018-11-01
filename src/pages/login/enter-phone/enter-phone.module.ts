import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnterPhonePage } from './enter-phone';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EnterPhonePage,
  ],
  imports: [
    IonicPageModule.forChild(EnterPhonePage),
    TranslateModule.forChild()
  ],
})
export class EnterPhonePageModule {}
