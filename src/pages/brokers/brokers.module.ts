import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrokersPage } from './brokers';

@NgModule({
  declarations: [
    BrokersPage,
  ],
  imports: [
    IonicPageModule.forChild(BrokersPage),
  ],
})
export class BrokersPageModule {}
