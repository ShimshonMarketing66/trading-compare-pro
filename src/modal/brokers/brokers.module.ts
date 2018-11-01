import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Brokers } from './brokers';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    Brokers,
  ],
  imports: [
    IonicPageModule.forChild(Brokers),
    TranslateModule.forChild(),
    PipesModule 
  ],
})
export class AboutUsPageModule {}
