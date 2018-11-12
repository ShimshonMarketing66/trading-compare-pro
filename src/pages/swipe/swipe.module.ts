import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwipePage } from './swipe';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    SwipePage
    ],
  imports: [
    IonicPageModule.forChild(SwipePage),
    DirectivesModule
  ],
})
export class SwipePageModule {}
