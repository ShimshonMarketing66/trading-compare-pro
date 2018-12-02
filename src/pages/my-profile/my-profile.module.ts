import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { MyProfilePage } from './my-profile';

@NgModule({
  declarations: [
    MyProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(MyProfilePage),
    PipesModule,
    ComponentsModule,
    DirectivesModule
  ]
})
export class MyProfilePageModule {}
