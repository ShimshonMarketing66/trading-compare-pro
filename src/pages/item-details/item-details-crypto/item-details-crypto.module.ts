import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { ItemDetailsCryptoPage } from './item-details-crypto';
import { DirectivesModule } from '../../../directives/directives.module';


@NgModule({
  declarations: [
    ItemDetailsCryptoPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailsCryptoPage),
    PipesModule,
    ComponentsModule,
    DirectivesModule
  ],
})
export class ItemDetailsPageModule {}
