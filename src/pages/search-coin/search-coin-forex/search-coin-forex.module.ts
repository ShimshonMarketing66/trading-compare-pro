import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchCoinForex } from './search-coin-forex';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchCoinForex,
  ],
  imports: [
    IonicPageModule.forChild(SearchCoinForex),
    PipesModule
  ],
})
export class SearchCoinPageModule {}
