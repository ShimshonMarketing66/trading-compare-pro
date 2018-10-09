import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { ItemDetailsStockPage } from './item-details-stock';


@NgModule({
  declarations: [
    ItemDetailsStockPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailsStockPage),
    PipesModule,
    ComponentsModule
  ],
})
export class ItemDetailsPageModule {}
