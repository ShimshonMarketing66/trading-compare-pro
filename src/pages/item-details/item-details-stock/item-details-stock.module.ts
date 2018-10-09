import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { ItemDetailsStockPage } from './item-details-stock';
import { AmChartsModule } from '@amcharts/amcharts3-angular';


@NgModule({
  declarations: [
    ItemDetailsStockPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailsStockPage),
    PipesModule,
    AmChartsModule,
    ComponentsModule
  ],
})
export class ItemDetailsPageModule {}
