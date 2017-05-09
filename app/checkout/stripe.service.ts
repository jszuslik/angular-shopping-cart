import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class StripeService {
    constructor (private _http: Http) {
        this.host_name = getHostName();
    }
    host_name: string = '';
    private _stripePaymentUrl = this.host_name+'/StoreApi/Checkout/RecordOrderPayment';
    private _bailOutOfStripeUrl = this.host_name+'/StoreApi/Checkout/RecordOrderContact';

    submitStripePayment(data: any, token: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.post(this._stripePaymentUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    bailOutOfStripe(token: any){
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._bailOutOfStripeUrl, {
            headers : headers
        }).map(res => res.json());
    }

}
function getHostName(){
    var base_url = window.location.origin;
    return base_url;
}