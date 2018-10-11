import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpPage } from './sign-up';
import { TranslateModule } from '@ngx-translate/core';
import { Profile } from '../../../models/profile-model';

@NgModule({
  declarations: [
    SignUpPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpPage),
    TranslateModule.forChild()
  ], providers:[Profile],
})
export class SignUpPageModule {}
