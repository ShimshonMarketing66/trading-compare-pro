import { Component } from "@angular/core";
import { IonicPage, NavParams, ViewController } from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import { TrackProvider } from "../../providers/track/track";

@IonicPage({
    name: "brokers-modal"
})
@Component({
    selector: 'page-brokers',
    templateUrl: 'brokers.html',
})

export class Brokers {
    brokersTMP: any[];
    myInput: string;
    brokersFilePath: string = './assets/lot of data/brokers.json';
    brokers: any[]
    constructor( public track:TrackProvider,public view: ViewController, public http: HttpClient) {
        this.http.get(this.brokersFilePath)
            .toPromise()
            .then((response) => {
                this.brokers = response["brokers"];
                this.brokersTMP = response["brokers"];
            })
    }

    closeModal() {
        this.view.dismiss();
    }

    choosebrokers(i) {
        this.view.dismiss(this.brokers[i]);
    }

    getItems(ev: any) {
        let val = ev.target.value;
        if (val == undefined) {
            this.brokers = this.brokersTMP
            return
        }
        this.brokers = this.brokersTMP.filter((item) => {
            
            return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }

}