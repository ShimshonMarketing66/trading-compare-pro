import { Component } from "@angular/core";
import { IonicPage, ViewController, NavParams } from "ionic-angular";
import { SocialSharing } from "@ionic-native/social-sharing";
import { GlobalProvider } from "../../providers/global/global";
import { TrackProvider } from "../../providers/track/track";

@IonicPage({
    name: "share-comment"
})

@Component({
    selector: 'page-share-comment',
    templateUrl: 'share-comment.html',
})

export class ShareComment {
    constructor( public track:TrackProvider,
        public globalProvider:GlobalProvider,
        public navParams:NavParams,
        public socialSharing:SocialSharing,
        public viewCtrl: ViewController
    ) {



    }

    share(app_id:string){
        let symbol = this.navParams.get("comment").symbol as string;
        let symbol_type = this.globalProvider.get_symbol_type(symbol);
        let img;
        switch (symbol_type) {
            case "STOCK":
            img = "https://storage.googleapis.com/iex/api/logos/" + symbol + ".png";   
                break;
                case "CRYPTO":
                img = "https://cloud-marketing66.herokuapp.com/logo/" + symbol;
                    break;
                    case "FOREX":
                    img = "https://xosignals.herokuapp.com/api2/sendImgByName/" + (symbol.charAt(0)+ symbol.charAt(1) +symbol.charAt(2)).toLowerCase() + "%20" + (symbol.charAt(3) + symbol.charAt(4)+symbol.charAt(5)).toLowerCase();   
                        break;
        
            default:
                break;
        }
        this.socialSharing.shareVia(app_id,this.navParams.get("comment").txt,this.navParams.get("comment").symbol,img,)
    }
}