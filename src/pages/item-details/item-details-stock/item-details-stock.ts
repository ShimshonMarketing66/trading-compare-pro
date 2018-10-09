import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

import { Http, Headers } from '@angular/http';
import { StockProvider } from '../../../providers/stock/stock';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';

@IonicPage({
  name: "item-details-stock"
})
@Component({
  selector: 'page-item-details-stock',
  templateUrl: 'item-details-stock.html',
})
export class ItemDetailsStockPage implements AfterViewInit {


  public options: any;
  private chart: AmChart;
  private timer: number;


  item: any;
  selectedSegment: string = "CHAT";
  slideNow: string;
  slides: { id: string; }[];
  @ViewChild('slideChat') slideChat: any;
  @ViewChild('slideOverview') slideOverview: any;
  @ViewChild('slideChart') slideChart: any;
  @ViewChild('slideSocial') slideSocial: any;
  @ViewChild('slideNews') slideNews: any;
  @ViewChild('mySlider') slider: Slides;
  tweetsdata;
  constructor(
    private AmCharts: AmChartsService,
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public stockProvider: StockProvider) {
    this.item = navParams.get("item");
    this.tweetCall();
    this.slides = [
      {
        id: "CHAT"
      },
      {
        id: "OVERVIEW"
      }, {
        id: "CHART"
      }, {
        id: "SOCIAL"
      }, {
        id: "NEWS"
      }
    ];
  }


  tweetCall() {
    this.http.get('https://xosignals.herokuapp.com/search/' + this.item.symbol + "/en").toPromise().then((res) => {
      this.tweetsdata = res.json().data.statuses;
      for (let index = 0; index < this.tweetsdata.length; index++) {
        let str = this.tweetsdata[index].created_at.split(" ");
        this.tweetsdata[index].created_at = str[1] + " " + str[2] + " " + " " + str[3].substring(0, 5);
        let index2 = this.tweetsdata[index].text.indexOf("https")
        if (index2 > -1) {
          let x = index2;
          this.tweetsdata[index].text = this.tweetsdata[index].text.substring(0, x);
        }
      }
    }).catch((err) => {
      console.log("avi", err);

    });
  }

  ngAfterViewInit(): void {
    this.slideNow = this.slideChat;
    this.chart = this.AmCharts.makeChart('chartdiv1', this.makeOptions(this.makeRandomDataProvider()));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
  }

  onSlideChanged(slider) {
    if (slider.getActiveIndex() == 5) return;
    const currentSlide = this.slides[slider.getActiveIndex()];
    if (currentSlide == undefined) return;
    this.selectedSegment = currentSlide.id;
  }


  changeSegment(segment) {
    if (this.selectedSegment == segment) return;
    switch (segment) {
      case "CHAT":
        console.log("CHAT");
        this.selectedSegment = "CHAT";
        break;
      case "OVERVIEW":
        console.log("OVERVIEW");
        this.selectedSegment = "OVERVIEW";
        break;
      case "CHART":
        console.log("CHART");
        this.selectedSegment = "CHART";
        break;
      case "SOCIAL":
        console.log("SOCIAL");
        this.selectedSegment = "SOCIAL";
        break;
      case "NEWS":
        console.log("NEWS");
        this.selectedSegment = "NEWS";
        break;
      default:
        break;
    }

    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segment;
    });
    this.slider.slideTo(selectedIndex);
  }


  openUrl(i) {
    window.open("https://twitter.com/i/web/status/" + this.tweetsdata[i].id_str);
  }

  getImgStock() {
    return this.item["logo"];
  }

  errorHandler(event) {
    console.debug(event);
    event.target.src = "assets/imgs/flags/flag general.png";
  }


  makeRandomDataProvider() {
    const dataProvider = [];

    // Generate random data
    for (let year = 1950; year <= 2005; ++year) {
      dataProvider.push({
        year: '' + year,
        value: Math.floor(Math.random() * 100) - 50
      });
    }

    return dataProvider;
  }

  makeOptions(dataProvider) {
    return {
      "type": "serial",
      "theme": "dark",
      "dataDateFormat": "YYYY-MM-DD",
      "valueAxes": [ {
        "id": "v1",
        "axisAlpha": 0,
        "position": "left",
        "ignoreAxisWidth": true
      } ],
      "balloon": {
        "borderThickness": 1,
        "shadowAlpha": 0
      },
      "graphs": [ {
        "id": "g1",
        "balloon": {
          "drop": true,
          "adjustBorderColor": false,
          "color": "#ffffff",
          "type": "smoothedLine"
        },
        "fillAlphas": 0.2,
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "bulletSize": 5,
        "hideBulletsCount": 50,
        "lineThickness": 2,
        "title": "red line",
        "useLineColorForBulletBorder": true,
        "valueField": "value",
      } ],
      "chartCursor": {
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "cursorAlpha": 0,
        "zoomable": false,
        "valueZoomable": true,
        "valueLineAlpha": 0.5
      },
      "valueScrollbar": {
        "autoGridCount": true,
        "color": "#000000",
        "scrollbarHeight": 50
      },
      "categoryField": "date",
      "categoryAxis": {
        "parseDates": true,
        "dashLength": 1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      },
      "dataProvider": [ {
        "date": "2012-07-27",
        "value": 13
      }, {
        "date": "2012-07-28",
        "value": 11
      }, {
        "date": "2012-07-29",
        "value": 15
      }, {
        "date": "2012-07-30",
        "value": 16
      }, {
        "date": "2012-07-31",
        "value": 18
      }, {
        "date": "2012-08-01",
        "value": 13
      }, {
        "date": "2012-08-02",
        "value": 22
      }, {
        "date": "2012-08-03",
        "value": 23
      }, {
        "date": "2012-08-04",
        "value": 20
      }, {
        "date": "2012-08-05",
        "value": 17
      }, {
        "date": "2012-08-06",
        "value": 16
      }, {
        "date": "2012-08-07",
        "value": 18
      }, {
        "date": "2012-08-08",
        "value": 21
      }, {
        "date": "2012-08-09",
        "value": 26
      }, {
        "date": "2012-08-10",
        "value": 24
      }, {
        "date": "2012-08-11",
        "value": 29
      }, {
        "date": "2012-08-12",
        "value": 32
      }, {
        "date": "2012-08-13",
        "value": 18
      }, {
        "date": "2012-08-14",
        "value": 24
      }, {
        "date": "2012-08-15",
        "value": 22
      }, {
        "date": "2012-08-16",
        "value": 18
      }, {
        "date": "2012-08-17",
        "value": 19
      }, {
        "date": "2012-08-18",
        "value": 14
      }, {
        "date": "2012-08-19",
        "value": 15
      }, {
        "date": "2012-08-20",
        "value": 12
      }, {
        "date": "2012-08-21",
        "value": 8
      }, {
        "date": "2012-08-22",
        "value": 9
      }, {
        "date": "2012-08-23",
        "value": 8
      }, {
        "date": "2012-08-24",
        "value": 7
      }, {
        "date": "2012-08-25",
        "value": 5
      }, {
        "date": "2012-08-26",
        "value": 11
      }, {
        "date": "2012-08-27",
        "value": 13
      }, {
        "date": "2012-08-28",
        "value": 18
      }, {
        "date": "2012-08-29",
        "value": 20
      }, {
        "date": "2012-08-30",
        "value": 29
      }, {
        "date": "2012-08-31",
        "value": 33
      }, {
        "date": "2012-09-01",
        "value": 42
      }, {
        "date": "2012-09-02",
        "value": 35
      }, {
        "date": "2012-09-03",
        "value": 31
      }, {
        "date": "2012-09-04",
        "value": 47
      }, {
        "date": "2012-09-05",
        "value": 52
      }, {
        "date": "2012-09-06",
        "value": 46
      }, {
        "date": "2012-09-07",
        "value": 41
      }, {
        "date": "2012-09-08",
        "value": 43
      }, {
        "date": "2012-09-09",
        "value": 40
      }, {
        "date": "2012-09-10",
        "value": 39
      }, {
        "date": "2012-09-11",
        "value": 34
      }, {
        "date": "2012-09-12",
        "value": 29
      }, {
        "date": "2012-09-13",
        "value": 34
      }, {
        "date": "2012-09-14",
        "value": 37
      }, {
        "date": "2012-09-15",
        "value": 42
      }, {
        "date": "2012-09-16",
        "value": 49
      }, {
        "date": "2012-09-17",
        "value": 46
      }, {
        "date": "2012-09-18",
        "value": 47
      }, {
        "date": "2012-09-19",
        "value": 55
      }, {
        "date": "2012-09-20",
        "value": 59
      }, {
        "date": "2012-09-21",
        "value": 58
      }, {
        "date": "2012-09-22",
        "value": 57
      }, {
        "date": "2012-09-23",
        "value": 61
      }, {
        "date": "2012-09-24",
        "value": 59
      }, {
        "date": "2012-09-25",
        "value": 67
      }, {
        "date": "2012-09-26",
        "value": 65
      }, {
        "date": "2012-09-27",
        "value": 61
      }, {
        "date": "2012-09-28",
        "value": 66
      }, {
        "date": "2012-09-29",
        "value": 69
      }, {
        "date": "2012-09-30",
        "value": 71
      }, {
        "date": "2012-10-01",
        "value": 67
      }, {
        "date": "2012-10-02",
        "value": 63
      }, {
        "date": "2012-10-03",
        "value": 46
      }, {
        "date": "2012-10-04",
        "value": 32
      }, {
        "date": "2012-10-05",
        "value": 21
      }, {
        "date": "2012-10-06",
        "value": 18
      }, {
        "date": "2012-10-07",
        "value": 21
      }, {
        "date": "2012-10-08",
        "value": 28
      }, {
        "date": "2012-10-09",
        "value": 27
      }, {
        "date": "2012-10-10",
        "value": 36
      }, {
        "date": "2012-10-11",
        "value": 33
      }, {
        "date": "2012-10-12",
        "value": 31
      }, {
        "date": "2012-10-13",
        "value": 30
      }, {
        "date": "2012-10-14",
        "value": 34
      }, {
        "date": "2012-10-15",
        "value": 38
      }, {
        "date": "2012-10-16",
        "value": 37
      }, {
        "date": "2012-10-17",
        "value": 44
      }, {
        "date": "2012-10-18",
        "value": 49
      }, {
        "date": "2012-10-19",
        "value": 53
      }, {
        "date": "2012-10-20",
        "value": 57
      }, {
        "date": "2012-10-21",
        "value": 60
      }, {
        "date": "2012-10-22",
        "value": 61
      }, {
        "date": "2012-10-23",
        "value": 69
      }, {
        "date": "2012-10-24",
        "value": 67
      }, {
        "date": "2012-10-25",
        "value": 72
      }, {
        "date": "2012-10-26",
        "value": 77
      }, {
        "date": "2012-10-27",
        "value": 75
      }, {
        "date": "2012-10-28",
        "value": 70
      }, {
        "date": "2012-10-29",
        "value": 72
      }, {
        "date": "2012-10-30",
        "value": 70
      }, {
        "date": "2012-10-31",
        "value": 72
      }, {
        "date": "2012-11-01",
        "value": 73
      }, {
        "date": "2012-11-02",
        "value": 67
      }, {
        "date": "2012-11-03",
        "value": 68
      }, {
        "date": "2012-11-04",
        "value": 65
      }, {
        "date": "2012-11-05",
        "value": 71
      }, {
        "date": "2012-11-06",
        "value": 75
      }, {
        "date": "2012-11-07",
        "value": 74
      }, {
        "date": "2012-11-08",
        "value": 71
      }, {
        "date": "2012-11-09",
        "value": 76
      }, {
        "date": "2012-11-10",
        "value": 77
      }, {
        "date": "2012-11-11",
        "value": 81
      }, {
        "date": "2012-11-12",
        "value": 83
      }, {
        "date": "2012-11-13",
        "value": 80
      }, {
        "date": "2012-11-14",
        "value": 81
      }, {
        "date": "2012-11-15",
        "value": 87
      }, {
        "date": "2012-11-16",
        "value": 82
      }, {
        "date": "2012-11-17",
        "value": 86
      }, {
        "date": "2012-11-18",
        "value": 80
      }, {
        "date": "2012-11-19",
        "value": 87
      }, {
        "date": "2012-11-20",
        "value": 83
      }, {
        "date": "2012-11-21",
        "value": 85
      }, {
        "date": "2012-11-22",
        "value": 84
      }, {
        "date": "2012-11-23",
        "value": 82
      }, {
        "date": "2012-11-24",
        "value": 73
      }, {
        "date": "2012-11-25",
        "value": 71
      }, {
        "date": "2012-11-26",
        "value": 75
      }, {
        "date": "2012-11-27",
        "value": 79
      }, {
        "date": "2012-11-28",
        "value": 70
      }, {
        "date": "2012-11-29",
        "value": 73
      }, {
        "date": "2012-11-30",
        "value": 61
      }, {
        "date": "2012-12-01",
        "value": 62
      }, {
        "date": "2012-12-02",
        "value": 66
      }, {
        "date": "2012-12-03",
        "value": 65
      }, {
        "date": "2012-12-04",
        "value": 73
      }, {
        "date": "2012-12-05",
        "value": 79
      }, {
        "date": "2012-12-06",
        "value": 78
      }, {
        "date": "2012-12-07",
        "value": 78
      }, {
        "date": "2012-12-08",
        "value": 78
      }, {
        "date": "2012-12-09",
        "value": 74
      }, {
        "date": "2012-12-10",
        "value": 73
      }, {
        "date": "2012-12-11",
        "value": 75
      }, {
        "date": "2012-12-12",
        "value": 70
      }, {
        "date": "2012-12-13",
        "value": 77
      }, {
        "date": "2012-12-14",
        "value": 67
      }, {
        "date": "2012-12-15",
        "value": 62
      }, {
        "date": "2012-12-16",
        "value": 64
      }, {
        "date": "2012-12-17",
        "value": 61
      }, {
        "date": "2012-12-18",
        "value": 59
      }, {
        "date": "2012-12-19",
        "value": 53
      }, {
        "date": "2012-12-20",
        "value": 54
      }, {
        "date": "2012-12-21",
        "value": 56
      }, {
        "date": "2012-12-22",
        "value": 59
      }, {
        "date": "2012-12-23",
        "value": 58
      }, {
        "date": "2012-12-24",
        "value": 55
      }, {
        "date": "2012-12-25",
        "value": 52
      }, {
        "date": "2012-12-26",
        "value": 54
      }, {
        "date": "2012-12-27",
        "value": 50
      }, {
        "date": "2012-12-28",
        "value": 50
      }, {
        "date": "2012-12-29",
        "value": 51
      }, {
        "date": "2012-12-30",
        "value": 52
      }, {
        "date": "2012-12-31",
        "value": 58
      }, {
        "date": "2013-01-01",
        "value": 60
      }, {
        "date": "2013-01-02",
        "value": 67
      }, {
        "date": "2013-01-03",
        "value": 64
      }, {
        "date": "2013-01-04",
        "value": 66
      }, {
        "date": "2013-01-05",
        "value": 60
      }, {
        "date": "2013-01-06",
        "value": 63
      }, {
        "date": "2013-01-07",
        "value": 61
      }, {
        "date": "2013-01-08",
        "value": 60
      }, {
        "date": "2013-01-09",
        "value": 65
      }, {
        "date": "2013-01-10",
        "value": 75
      }, {
        "date": "2013-01-11",
        "value": 77
      }, {
        "date": "2013-01-12",
        "value": 78
      }, {
        "date": "2013-01-13",
        "value": 70
      }, {
        "date": "2013-01-14",
        "value": 70
      }, {
        "date": "2013-01-15",
        "value": 73
      }, {
        "date": "2013-01-16",
        "value": 71
      }, {
        "date": "2013-01-17",
        "value": 74
      }, {
        "date": "2013-01-18",
        "value": 78
      }, {
        "date": "2013-01-19",
        "value": 85
      }, {
        "date": "2013-01-20",
        "value": 82
      }, {
        "date": "2013-01-21",
        "value": 83
      }, {
        "date": "2013-01-22",
        "value": 88
      }, {
        "date": "2013-01-23",
        "value": 85
      }, {
        "date": "2013-01-24",
        "value": 85
      }, {
        "date": "2013-01-25",
        "value": 80
      }, {
        "date": "2013-01-26",
        "value": 87
      }, {
        "date": "2013-01-27",
        "value": 84
      }, {
        "date": "2013-01-28",
        "value": 83
      }, {
        "date": "2013-01-29",
        "value": 84
      }, {
        "date": "2013-01-30",
        "value": 81
      } ]
    }
  }


  ngOnDestroy() {
    clearInterval(this.timer);

    // Cleanup chartdiv2
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

  // This must be called when making any changes to the chart

  /*
this.AmCharts.updateChart(this.chart, () => {
  // Change whatever properties you want
  this.chart.dataProvider = [];
});
*/

}
