import {Component, Output, EventEmitter} from '@angular/core'

import * as _exports from '../chartiq_library/js/chartiq';
var CIQ = _exports.CIQ;

@Component({
  selector: 'timezone-dialog',
  styleUrls:['../css/CIQ_Seed.css'],
  templateUrl: './timezone.dialog.component.html',
})

export class TimezoneDialog{
  ciq:any;
  timezoneMap:any;
  timezones:any=[];
  myZone:any;
  @Output() launchDialog=new EventEmitter<any>();

  constructor(){
    this.timezoneMap=CIQ.timeZoneMap;
    this.myZone=true; //default behavior
  }

  launchTimezoneDialog(chart){
    for(let i in this.timezoneMap){
      this.timezones.push(this.timezoneMap[i]);
    }
    this.timezones.sort(function(a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      // must be equal
      return 0;
    });
    this.ciq=chart;
    this.launchDialog.emit(true);
  }

  setTimezone(zone){
    this.ciq.setTimeZone(this.ciq.dataZone, zone);
    this.myZone=false;
    if(this.ciq.chart.symbol) this.ciq.draw();
    this.launchDialog.emit(false);
  };

  setMyTimezone(){
    this.ciq.defaultDisplayTimeZone=null;
    for(var i=0;i<CIQ.ChartEngine.registeredContainers.length;i++){
      var stx=CIQ.ChartEngine.registeredContainers[i].stx;
      stx.displayZone=null;
      this.myZone=true;
      stx.setTimeZone();

      if(stx.displayInitialized) stx.draw();
    }
    if(this.ciq.chart.symbol) this.ciq.draw();
    this.closeMe();
  };

  closeMe=function(){
    this.launchDialog.emit(false);
  };
}
