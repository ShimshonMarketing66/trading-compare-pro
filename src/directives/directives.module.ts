import { NgModule } from '@angular/core';
import { SwipeSegmentDirective } from './swipe-segment/swipe-segment';
import { LongPressModule } from 'ionic-long-press';
@NgModule({
	declarations: [SwipeSegmentDirective],
	imports: [LongPressModule],
	exports: [SwipeSegmentDirective]
})
export class DirectivesModule {}
