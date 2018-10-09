import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { CommonModule } from '@angular/common';  

@NgModule({
	declarations: [ProgressBarComponent],
	imports: [CommonModule],
	exports: [ProgressBarComponent]
})
export class ComponentsModule {}
