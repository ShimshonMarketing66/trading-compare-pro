import {Component, OnInit, Input} from '@angular/core';
import {ChartService} from '../chart_service/chart.service';
import { TrackProvider } from '../../../providers/track/track';



declare var CIQ;
declare var $$$;;


@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  providers: [ChartService]
})

export class ChartComponent implements OnInit {
  CIQ: any;
  ciq: any;
  @Input() symbol:string;
  @Input() exchDisp:string;
  @Input() group:string;
  @Input() country:string;
  sampleData: any[];
  chartSeries:any[];

  constructor( public track:TrackProvider,private chartService: ChartService) {
    this.chartSeries=[];
  };

  ngOnInit() {    
    this.CIQ = CIQ;
    this.ciq = new CIQ.ChartEngine({ container: $$$("#chartContainer"),layout:{"chartType": "mountain"}});
    this.ciq.setPeriodicityV2(1, 60);
    this.chartService.attachQuoteFeed(this.ciq);

    var symb = {
      symbol: this.symbol,
      exchDisp:this.exchDisp,
      group :this.group,
      country:this.country,
    }
    this.ciq.newChart(symb);
  }

  // https://angular.io/docs/ts/latest/api/core/index/OnDestroy-class.html
  ngOnDestroy() {
    // This will remove the quoteDriver, styles and
    // eventListeners for this ChartEngine instance.
    console.log("ngOnDestroy");
    
    this.ciq.destroy();
  }

  getLayout() {
    return this.ciq.layout;
  }

  removeSeries(series){
    var index = this.chartSeries.indexOf(series, 0);
    if (index > -1) {
      this.chartSeries.splice(index, 1);
    }
    this.ciq.removeSeries(series.display, this.ciq.ciq);
  }

  set(multiplier, span){
    var params={
      multiplier:multiplier,
      span:span,
    };
    this.ciq.setSpan(params, function(){
      console.log("span set");
    });
  };
}
