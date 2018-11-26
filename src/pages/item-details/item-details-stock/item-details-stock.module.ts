import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { ItemDetailsStockPage } from './item-details-stock';
import { LongPressModule } from 'ionic-long-press';

import { DirectivesModule } from '../../../directives/directives.module';


@NgModule({
  declarations: [
    ItemDetailsStockPage
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailsStockPage),
    PipesModule,
    ComponentsModule,
    DirectivesModule,
    LongPressModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class ItemForexDetailsPageModule {}
