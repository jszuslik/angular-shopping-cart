import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";

@Injectable()
export class BillingAddressService {
    constructor (private _http:Http) {
        this.host_name = getHostName();
    }
    host_name: string= '';
    private _getBillingAddressUrl = this.host_name+'/StoreApi/Billing/Billing';

    getBillingAddress(token: any){
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.get(this._getBillingAddressUrl, {
            headers: headers
        }).map(response => response.json());
    }
    editBillingAddress(data: any, token: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.post(this._getBillingAddressUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
}
function getHostName(){
    return window.location.origin;
}