import { CountryModel } from '../models/country-model';
import { Nexmo } from './nexmo-model';

export class Profile {
    verifyData:Nexmo =  new Nexmo();
    email: string = "";
    password: string = "";
    first_name: string = "";
    last_name: string = "";
    phone_number: string = "";
    _id: string = "";
    provider: string = "";
    platform: string = "";
    likes: string[] = [];
    unlikes: string[] = [];
    state: string = "unknown";
    token_notification: string = "";
    isAlvexo: boolean = false
    broker: string = "none";
    nickname: string = "";
    watchlist: any[] = [];
    createAccountDate: string = "";
    version: string = "";
    countryData: CountryModel = new CountryModel();
    description:string="";
}