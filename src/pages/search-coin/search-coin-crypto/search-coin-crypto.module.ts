import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { SearchCoinCrypto } from './search-coin-crypto';

@NgModule({
  declarations: [
    SearchCoinCrypto,
  ],
  imports: [
    IonicPageModule.forChild(SearchCoinCrypto),
    PipesModule
  ],
})
export class SearchCoinPageModule {}
