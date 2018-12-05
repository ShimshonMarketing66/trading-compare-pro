import { NgModule } from '@angular/core';
import { SwipeSegmentDirective } from './swipe-segment/swipe-segment';
import { LongPressModule } from 'ionic-long-press';
import { LongPress } from './long-press/long-press';
@NgModule({
	declarations: [SwipeSegmentDirective,
		LongPress],
	imports: [LongPressModule],
	exports: [SwipeSegmentDirective,
		LongPress]
})
export class DirectivesModule {}
