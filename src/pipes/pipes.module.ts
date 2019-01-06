import { NgModule } from '@angular/core';
import { CurrencySymbolPipe } from './currency-symbol/currency-symbol';
import { RmPointPipe } from './rm-point/rm-point';
import { TofixePipe } from './tofixe/tofixe';
import { FirstCapPipe } from './first-cap/first-cap';
import { TimePipe } from './time/time';
import { Tofixed_4Pipe } from './tofixed-4/tofixed-4';
@NgModule({
	declarations: [CurrencySymbolPipe,
    RmPointPipe,TofixePipe,
    FirstCapPipe,
    TimePipe,
    Tofixed_4Pipe],
	imports: [],
	exports: [CurrencySymbolPipe,
    RmPointPipe,TofixePipe,
    FirstCapPipe,
    TimePipe,
    Tofixed_4Pipe]
})
export class PipesModule {}
