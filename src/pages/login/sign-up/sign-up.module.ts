import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpPage } from './sign-up';
import { TranslateModule } from '@ngx-translate/core';
import { Profile } from '../../../models/profile-model';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    SignUpPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpPage),
    TranslateModule.forChild(),
    PipesModule 

  ], providers:[Profile],
})
export class SignUpPageModule {}
