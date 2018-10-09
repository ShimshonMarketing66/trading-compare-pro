import { NgModule } from '@angular/core';
import { CurrencySymbolPipe } from './currency-symbol/currency-symbol';
import { RmPointPipe } from './rm-point/rm-point';
import { TofixePipe } from './tofixe/tofixe';
@NgModule({
	declarations: [CurrencySymbolPipe,
    RmPointPipe,TofixePipe],
	imports: [],
	exports: [CurrencySymbolPipe,
    RmPointPipe,TofixePipe]
})
export class PipesModule {}
