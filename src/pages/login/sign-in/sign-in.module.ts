import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignInPage } from './sign-in';
import { TranslateModule } from '@ngx-translate/core';
import { Profile } from '../../../models/profile-model';

@NgModule({
  declarations: [
    SignInPage,
  ],
  imports: [
    TranslateModule.forChild(),
    IonicPageModule.forChild(SignInPage),
  ]
})
export class SignInPageModule {}
