import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { CommonModule } from '@angular/common';  
import { ChartUI } from './chartIQ/ui_component/ui.component';
import { StudyDialog } from './chartIQ/study_dialog_component/study.dialog.component';
import { ThemeDialog } from './chartIQ/theme_dialog_component/theme.dialog.component';
import { TimezoneDialog } from './chartIQ/timezone_dialog_component/timezone.dialog.component';
import { OverlayMenu } from './chartIQ/overlay_menu_component/overlay.menu';
import { DrawingToolbar } from './chartIQ/drawing_toolbar_component/drawing.toolbar.component';
import { TitlecasePipe } from './chartIQ/pipes/title.case.pipe';
import { Colorpicker } from './chartIQ/colorpicker_component/colorpicker';
import { MapObjectToArrayPipe } from './chartIQ/pipes/mapObject.pipe';
import { ChartComponent } from './chartIQ/chart_component/chart.component';
import { IonicModule } from 'ionic-angular';


@NgModule({
	declarations: [ProgressBarComponent,ChartUI,ChartComponent],
	imports: [CommonModule,IonicModule],
	exports: [ProgressBarComponent,ChartUI,ChartComponent],
	schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
