import { Component } from "@angular/core";
import { IonicPage, NavParams, ViewController } from "ionic-angular";
import { HttpClient } from "@angular/common/http";

@IonicPage({
    name: "countriesModal"
})
@Component({
    selector: 'page-countries',
    templateUrl: 'countries.html',
})

export class Countries {
    countriesTMP: any[];
    myInput: string;
    countriesFilePath: string = './assets/lot of data/countries.json';
    countries: any[]
    a : string
    b:string
    constructor(params: NavParams, public view: ViewController, public http: HttpClient) {
       
        
        if (params.get("type") == "country") {
            console.log("country");
            this.a = "name";
            this.b = "dial_code";
        }else if (params.get("type") == "dial_code") {
            this.a = "dial_code"; 
            this.b = "name"
        }
        this.http.get(this.countriesFilePath)
            .toPromise()
            .then((response) => {
                console.log(response);
                
                this.countries = response["countries"];
                this.countriesTMP = response["countries"];
            })
    }

    closeModal() {
        this.view.dismiss();
    }

    chooseCountry(i) {
        this.view.dismiss(this.countries[i]);
    }

    getItems(ev: any) {
        let val = ev.target.value;
        if (val == undefined) {
            this.countries = this.countriesTMP;
            return
        }
        this.countries = this.countriesTMP.filter((item) => {
            
            return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }

}