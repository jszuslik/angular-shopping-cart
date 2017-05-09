import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";

@Injectable()
export class ShippingAddressService {
    constructor (private _http:Http) {
        this.host_name = getHostName();
    }
    host_name: string = '';
    private _getShippingAddressUrl = this.host_name+'/StoreApi/Shipping/Shipping';

    private _getShippingOptionsURL = this.host_name+'/StoreApi/Checkout/LoadShippingOption';
    private _setShippingOptionsURL = this.host_name+'/StoreApi/Checkout/SetShippingOption';

    private _setBillToOptionUrl = this.host_name+'/StoreApi/Checkout/SetBillToOption';

    getShippingAddress(token: any){
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.get(this._getShippingAddressUrl, {
            headers: headers
        }).map(response => response.json());
    }
    editShippingAddress(data: any, token: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.post(this._getShippingAddressUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    addShippingAddress(data: any, token: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.post(this._getShippingAddressUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    getShippingOptions(address): Observable<any> {
        const body = JSON.stringify(address);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._getShippingOptionsURL, body, {
            headers: headers
        }).map(response => response.json());
    }
    setShippingOption(row): Observable<any> {
        const body = JSON.stringify(row);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._setShippingOptionsURL, body, {
            headers: headers
        }).map(response => response.json());
    }
    setBillToOption(data: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._setBillToOptionUrl, body, {
            headers: headers
        }).map(response => response.json());
    }



}
function getHostName(){
    var base_url = window.location.origin;
    return base_url;
}