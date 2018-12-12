import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { ItemDetailsForexPage } from './item-details-forex';
import { DirectivesModule } from '../../../directives/directives.module';


@NgModule({
  declarations: [
    ItemDetailsForexPage
  
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailsForexPage),
    PipesModule,
    ComponentsModule,
    DirectivesModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItemStockDetailsPageModule {}
