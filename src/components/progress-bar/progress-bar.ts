import { Component,Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress;
  @Input('color') color;
  constructor() {
    
  }
  ngOnInit() {
    console.log('This if the value for user-id: ' + this.color);
}

}
