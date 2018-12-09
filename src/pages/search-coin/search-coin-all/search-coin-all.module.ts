import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { SearchCoinAll } from './search-coin-all';

@NgModule({
  declarations: [
    SearchCoinAll,
  ],
  imports: [
    IonicPageModule.forChild(SearchCoinAll),
    PipesModule
  ],
})
export class SearchCoinPageModule {}
