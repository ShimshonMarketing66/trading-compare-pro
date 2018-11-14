import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SentimentsPage } from './sentiments';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SentimentsPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SentimentsPage),
  ],
})
export class SentimentsPageModule {}
