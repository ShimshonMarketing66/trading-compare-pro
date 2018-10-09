import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CountryModalPage } from './country-modal';

@NgModule({
  declarations: [
    CountryModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CountryModalPage),
  ],
})
export class CountryModalPageModule {}
