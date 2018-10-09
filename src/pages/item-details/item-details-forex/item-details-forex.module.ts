import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { ItemDetailsForexPage } from './item-details-forex';


@NgModule({
  declarations: [
    ItemDetailsForexPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailsForexPage),
    PipesModule,
    ComponentsModule
  ],
})
export class ItemDetailsPageModule {}
