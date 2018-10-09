import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchCoinStock } from './search-coin-stock';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchCoinStock,
  ],
  imports: [
    IonicPageModule.forChild(SearchCoinStock),
    PipesModule
  ],
})
export class SearchCoinPageModule {}
