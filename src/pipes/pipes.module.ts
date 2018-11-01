import { NgModule } from '@angular/core';
import { CurrencySymbolPipe } from './currency-symbol/currency-symbol';
import { RmPointPipe } from './rm-point/rm-point';
import { TofixePipe } from './tofixe/tofixe';
import { FirstCapPipe } from './first-cap/first-cap';
@NgModule({
	declarations: [CurrencySymbolPipe,
    RmPointPipe,TofixePipe,
    FirstCapPipe],
	imports: [],
	exports: [CurrencySymbolPipe,
    RmPointPipe,TofixePipe,
    FirstCapPipe]
})
export class PipesModule {}
