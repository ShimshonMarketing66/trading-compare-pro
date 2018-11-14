import { NgModule } from '@angular/core';
import { CurrencySymbolPipe } from './currency-symbol/currency-symbol';
import { RmPointPipe } from './rm-point/rm-point';
import { TofixePipe } from './tofixe/tofixe';
import { FirstCapPipe } from './first-cap/first-cap';
import { TimePipe } from './time/time';
@NgModule({
	declarations: [CurrencySymbolPipe,
    RmPointPipe,TofixePipe,
    FirstCapPipe,
    TimePipe],
	imports: [],
	exports: [CurrencySymbolPipe,
    RmPointPipe,TofixePipe,
    FirstCapPipe,
    TimePipe]
})
export class PipesModule {}
